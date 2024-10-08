import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import pdf from "pdf-parse-debugging-disabled";
import { Innertube } from "youtubei.js/web";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  QueryCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
export { default as dayjs } from "dayjs";

const MAX_PAGES = 10;
const MAX_MINS = 60;
const region = process.env.AWS_REGION;
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);
const expiresIn = 86400; //24hrs
const TEXT_QUANTITY = 1000;
const settings = {
  serviceId: "bedrock",
  region,
};
const bedrock = new BedrockRuntimeClient(settings);
const youtube = await Innertube.create({
  lang: "en",
  location: "US",
  retrieve_player: false,
});

export const extractFileName = (key) => {
  let fileName = key.split("/");
  fileName = fileName[fileName.length - 1];
  return fileName;
};

export const publishToTopic = async (client, topic, payload) => {
  try {
    const iotParams = {
      topic,
      payload: JSON.stringify(payload),
      qos: 1,
    };

    let result = await client.publish(iotParams).promise();
    console.log("Message sent:", result);
  } catch (err) {
    console.error("iotPublish error:", err);
  }
};

export const generateSignedUrl = async (getObjectParams) => {
  const client = new S3Client({ region });
  const command = new GetObjectCommand(getObjectParams);
  return getSignedUrl(client, command, { expiresIn });
};

export const getS3Object = async (getObjectParams) => {
  const client = new S3Client({ region });
  const command = new GetObjectCommand(getObjectParams);
  return client.send(command);
};

export const extractPdfContent = async (pdfContent) => {
  const data = await pdf(pdfContent, { max: MAX_PAGES });
  const result = [];

  const pages = data.text.split(/\r?\n\r?\n/);
  pages.shift(); //removes first item in array because its always ""

  const endPage = pages.length;
  if (endPage > MAX_PAGES) {
    throw `End number page must be less than ${MAX_PAGES}, choose a lower number`;
  }

  for (let i = 0; i < endPage; i++) {
    result.push({
      text: pages[i].replace(/\s+/g, " ").trim(),
      page: i + 1,
    });
  }
  return result;
};

const extractVideoId = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
};

export const extractYoutubeTranscript = async (youtubeVideoUrl) => {
  const info = await youtube.getInfo(extractVideoId(youtubeVideoUrl));
  const transcriptData = await info.getTranscript();
  const maxMilliSeconds = MAX_MINS * 60 * 1000;
  let extractedTranscript = [];

  transcriptData.transcript.content.body.initial_segments.map((entry) => {
    const entryDuration = Number(entry.end_ms) || 0;
    if (entryDuration <= maxMilliSeconds) {
      extractedTranscript.push({
        time: Number(entry.start_time_text.text.split(":")[0]),
        text: entry.snippet.text.replace(/\s+/g, " ").trim(),
      });
    } else return;
  });

  return extractedTranscript;
};

export const generateSubstringsPdf = (data) => {
  try {
    const substrings = data.reduce((acc, item) => {
      const lastResult = acc[acc.length - 1];
      const remainingChars =
        TEXT_QUANTITY - (lastResult ? lastResult.text.length : 0);

      if (remainingChars >= item.text.length) {
        if (lastResult) {
          lastResult.text += item.text;
        } else {
          acc.push({
            page: item.page,
            text: item.text,
          });
        }
      } else {
        for (let i = 0; i < item.text.length; i += TEXT_QUANTITY) {
          acc.push({
            page: item.page,
            text: item.text.substring(i, i + TEXT_QUANTITY),
          });
        }
      }

      return acc;
    }, []);

    return substrings;
  } catch (e) {
    throw e;
  }
};

export const generateSubstringsYoutube = (data) => {
  try {
    const substrings = [];
    let currentText = "";
    let currentTime = [];

    for (const item of data) {
      currentTime.push(item.time);
      currentText += item.text;

      if (currentText.length >= TEXT_QUANTITY) {
        substrings.push({
          text: currentText,
          mins: currentTime[0],
        });
        currentText = "";
        currentTime = [];
      }
    }

    // If there is remaining text, create an additional result item.
    if (currentText.length > 0) {
      substrings.push({
        text: currentText.substring(0, TEXT_QUANTITY),
        mins: currentTime[0],
      });
    }

    return substrings;
  } catch (e) {
    throw e;
  }
};

const prompt = (cont) => `Human: You are a friendly, concise chatbot.
Generate 1 question with 4 options(each having 3 wrong and 1 right answer) 

Return an array only using this sample:
[{
index: 1,
question: "Question", //Max 110 characters
options: ["option1", "option2", "option3", "option4"],
correctAnswerIndex: "3",
correctAnswerString: "option3",
explanation: "Explanation why the option3 is correct"
}]

Only generate the question from the provided below and from nothing else

<context>
${cont}
 </context>
\n\nAssistant:`;

const invokeBedrock = async (prompt, max_tokens_to_sample = 2000) => {
  return bedrock.send(
    new InvokeModelCommand({
      modelId: "anthropic.claude-instant-v1",
      contentType: "application/json",
      accept: "*/*",
      body: JSON.stringify({
        prompt,
        max_tokens_to_sample,
        top_p: 0.99,
        stop_sequences: ["\n\nHuman:"],
        anthropic_version: "bedrock-2023-05-31",
      }),
    })
  );
};

const formatBedrockResponse = (
  string,
  index,
  context,
  num = null,
  type = null
) => {
  // Match everything between curly braces
  const jsonContentRegex = /\{([^}]+)\}/g;
  const matches = string.match(jsonContentRegex)[0].replace(/\s+/g, " ").trim();

  console.log({ string, context, matches });
  let obj;
  eval("obj=" + matches);
  let correct = 1 + obj.options.findIndex((x) => x === obj.correctAnswerString);

  return {
    id: String(index + 1),
    question:
      num !== null ? `${obj.question} - From ${type} ${num}` : obj.question,
    context,
    questionType: "text",
    answers: obj.options,
    correctAnswerString: obj.correctAnswerString,
    correctAnswer: String(correct === 0 ? obj.correctAnswerIndex : correct),
    messageForCorrectAnswer: "Correct answer. Good job.",
    messageForIncorrectAnswer: "Incorrect answer.",
    explanation: obj.explanation,
    answerSelectionType: "single",
    point: "1",
  };
};

export const getQuestionsFromYoutubeWithBedrock = async (substrings) => {
  const axiosPromises = substrings.map((substring) =>
    invokeBedrock(
      prompt(
        substring.text,
        "detected language within <context></context> tag"
      ),
      2000
    )
  );
  let questions = [];
  const results = await Promise.all(axiosPromises);

  results.forEach(async (result, i) => {
    const parsedResponsed = JSON.parse(new TextDecoder().decode(result.body));
    questions.push(
      formatBedrockResponse(
        parsedResponsed.completion,
        i,
        substrings[i].text,
        substrings[i].mins,
        "minute"
      )
    );
  });

  return questions;
};

export const getQuestionsFromPdfWithBedrock = async (substrings) => {
  const axiosPromises = substrings.map((substring) =>
    invokeBedrock(
      prompt(
        substring.text,
        "detected language within <context></context> tag"
      ),
      2000
    )
  );
  let questions = [];
  const results = await Promise.all(axiosPromises);

  results.forEach(async (result, i) => {
    const parsedResponsed = JSON.parse(new TextDecoder().decode(result.body));
    questions.push(
      formatBedrockResponse(
        parsedResponsed.completion,
        i,
        substrings[i].text,
        substrings[i].page,
        "page"
      )
    );
  });

  return questions;
};

export const generateUuid = () => uuidv4();

export const getYoutubeTitle = async (url) => {
  try {
    const info = await youtube.getInfo(extractVideoId(url));
    const scrapedContent = {
      title: info.primary_info.title.text
    };

    return scrapedContent;
  } catch (error) {
    console.error("Error fetching Youtube title: ", error.message);
    throw error;
  }
};

export const saveToTable = async (tableName, props) => {
  try {
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...props,
      },
    });
    return docClient.send(command);
  } catch (e) {
    console.log("Error while saving: ", e);
    return false;
  }
};

export const fetchFromTableByGS1PK = async (tableName, PK) => {
  try {
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: "GS1",
      KeyConditionExpression: "GS1PK=:pk",
      ExpressionAttributeValues: {
        ":pk": PK,
      },
    });
    return docClient.send(command);
  } catch (e) {
    console.log("Error while fetching: ", e);
    return false;
  }
};

export const fetchFromTableByPK = async (tableName, PK) => {
  try {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK=:pk",
      ExpressionAttributeValues: {
        ":pk": PK,
      },
      ConsistentRead: true,
    });
    return docClient.send(command);
  } catch (e) {
    console.log("Error while fetching: ", e);
    return false;
  }
};

export const extractFileNameWithoutExtension = (s3Key) => {
  // Extract the file name with extension
  const fileNameWithExt = s3Key.split("/").pop();

  // Remove the file extension
  const fileName = fileNameWithExt.split(".").slice(0, -1).join(".");

  // Remove leading numbers followed by a dash or underscore
  const cleanedFileName = fileName.replace(/^\d+[-_]/, "");

  return cleanedFileName;
};
