import AWS from "aws-sdk";
import {
  publishToTopic,
  extractFileName,
  extractPdfContent,
  getS3Object,
} from "../../utils/helper.mjs";
import { ProcessingStages } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;
AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event) => {
  const { Bucket, Key } = event;
  console.log({ Key, Bucket });
  let res = {
    status: "SUCCESS",
  };

  // Download the file from S3
  const params = { Bucket, Key };
  const { Body } = await getS3Object(params);

  // Convert the buffer to a string
  const content = Buffer.concat(await Body.toArray());

  // Extract content based on file type
  let extractedContent;
  if (Key.endsWith(".pdf")) {
    extractedContent = await extractPdfContent(content);
  } else {
    console.error("Unsupported file type");
    return { error: "Unsupported file type" };
  }

  if (!extractedContent === "") {
    res = {
      status: ProcessingStages.ERROR,
      error: "Invalid Pdf or setting provided",
    };
  }

  console.log({ extractedContent });

  //Iot
  res = {
    status: ProcessingStages.SUCCESS,
    data: { Key, value: extractedContent },
  };
  await publishToTopic(iotClient, extractFileName(Key), res);

  return res;
};
