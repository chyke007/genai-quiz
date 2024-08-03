import AWS from "aws-sdk";
import {
  publishToTopic,
  extractFileName,
  extractPdfContent,
  getS3Object,
} from "../../utils/helper.mjs";
import { ProcessingStages, sourceType } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;
AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event) => {
  const { Bucket, Key } = event;
  let res = {
    status: ProcessingStages.EXTRACTING_CONTENT,
  };
  try {
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
      res = {
        status: ProcessingStages.ERROR,
        error: "Unsupported file type",
      };
    }

    if (!extractedContent === "") {
      res = {
        status: ProcessingStages.ERROR,
        error: "Invalid Pdf or setting provided",
      };
    }

    await publishToTopic(iotClient, extractFileName(Key), res);
    
    res = {
      status: ProcessingStages.SUCCESS,
      data: { key: Key, bucket: Bucket, value: extractedContent },
      source: sourceType.S3
    };
  } catch (e) {
    res = {
      status: ProcessingStages.ERROR,
      error: "An error occured",
    };
    await publishToTopic(iotClient, extractFileName(Key), res);
  }

  return res;
};
