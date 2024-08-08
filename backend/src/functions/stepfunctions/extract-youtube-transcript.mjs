import AWS from "aws-sdk";
import {
  publishToTopic,
  extractYoutubeTranscript,
} from "../../utils/helper.mjs";
import { ProcessingStages, sourceType } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event) => {
  const { link, key } = event;
  console.log({ key, link });
  let res = {
    status: ProcessingStages.EXTRACTING_CONTENT,
  };
  try {
    const extractedContent = await extractYoutubeTranscript(link);

    await publishToTopic(iotClient, key, res);
    res = {
      status: ProcessingStages.SUCCESS,
      data: { link, key, value: extractedContent },
      source: sourceType.YOUTUBE
    };
   
  } catch (e) {
    res = {
      status: ProcessingStages.ERROR,
      error: "An error occured",
    };
    console.log(e)
    await publishToTopic(iotClient, key, res);
  }
  return res;
};
