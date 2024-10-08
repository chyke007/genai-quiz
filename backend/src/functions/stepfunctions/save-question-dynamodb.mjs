import AWS from "aws-sdk";
import { publishToTopic, generateUuid, dayjs, saveToTable, extractFileName } from "../../utils/helper.mjs";
import { ProcessingStages, sourceType } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;
const { DYNAMODB_NAME } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event) => {
  const { head, source, key, value, title, content } = event.data;
  const dateNow = dayjs().toDate().toISOString();
  const contentId = generateUuid();
  let tableContent = {
    PK: `CONTENT#public`,
    SK: `${contentId}#${dateNow}`,
    GS1PK: `CONTENT#${contentId}`,
    GS1SK: `${dateNow}#${key}`,
    dateCreated: dateNow,
    dateUpdated: dateNow,
    contentId,
    title,
    source,
    questions: JSON.stringify(value),
    content,
    key
  };

  let res = {
    status: ProcessingStages.SAVING_IN_DATABASE,
  };

  try {
    if (source === sourceType.S3) {
      const url = `${head}/${key}`;
      tableContent.url = url
    } else {
      const url = head;
      tableContent.url = url
    }

    await publishToTopic(iotClient, source === sourceType.S3 ? extractFileName(key) : key, { status: res.status });

    await saveToTable(DYNAMODB_NAME, tableContent);

    res = {
      status: ProcessingStages.SUCCESS,
      data: { key, value },
    };
    await publishToTopic(iotClient, source === sourceType.S3 ? extractFileName(key) : key, { status: res.status, contentId });
  } catch (error) {
    console.log({ error });
    res = {
      status: ProcessingStages.ERROR,
      error: "An error occured",
    };
    await publishToTopic(iotClient, key, res);
  }
  return res;
};
