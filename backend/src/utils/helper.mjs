import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import pdf from "pdf-parse-debugging-disabled";
import TranscriptAPI from 'youtube-transcript-api';

const MAX_PAGES = 10;
const MAX_MINS = 60;
const region = process.env.AWS_REGION;
const expiresIn = 86400; //24hrs

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

export const getS3Object = async (getObjectParams) => {
  const client = new S3Client({ region });
  const command = new GetObjectCommand(getObjectParams);
  return client.send(command);
};

export const extractPdfContent = async (pdfContent) => {
  const data = await pdf(pdfContent, { max: MAX_PAGES });
  console.log(data, { max: MAX_PAGES });
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

const extractVideoId = (url)  => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
}

export const extractYoutubeTranscript = async (youtubeVideoUrl) => {
  const transcript = await TranscriptAPI.getTranscript(extractVideoId(youtubeVideoUrl));

  const maxSeconds = MAX_MINS * 60 * 1000;
  let totalSeconds = 0;
  let extractedTranscript = [];
  console.log({ transcript });

  for (const entry of transcript) {
    const entryDuration = entry.duration || 0;
    totalSeconds += entryDuration;

    if (totalSeconds <= maxSeconds) {
      extractedTranscript.push({
        duration: entry.duration,
        offset: entry.start,
        text: entry.text.replace(/\s+/g, " ").trim(),
      });
    } else {
      break;
    }
  }

  return extractedTranscript;
};
