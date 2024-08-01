import AWS from "aws-sdk";
import {
  publishToTopic,
  extractFileName,
  generateSubstringsPdf,
  getQuestionsFromPdfWithBedrock,
  extractFileNameWithoutExtension
} from "../../utils/helper.mjs";
import { ProcessingStages, sourceType } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;
AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event) => {
  const { bucket, key, value } = event.data;
  console.log({ key, bucket });
  let res = {
    status: ProcessingStages.GENERATING_QUESTIONS
  };
  try {
    
    const substrings = generateSubstringsPdf(value);
    const questions = await getQuestionsFromPdfWithBedrock(substrings)
    const title = extractFileNameWithoutExtension(key);

    await publishToTopic(iotClient, extractFileName(key), res);

    res = {
      status: ProcessingStages.SUCCESS,
      data: { head: bucket, key, value: questions, source: sourceType.S3, title,  content: JSON.stringify(value) },
    };
  } catch (error) {
    console.log({ error })
    res = {
      status: ProcessingStages.ERROR,
      error: "An error occured",
    };
    await publishToTopic(iotClient, extractFileName(key), res);
  }

  return res;
};
