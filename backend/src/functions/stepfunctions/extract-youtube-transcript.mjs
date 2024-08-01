import AWS from "aws-sdk";
import {
  publishToTopic,
  extractYoutubeTranscript,
} from "../../utils/helper.mjs";
import { ProcessingStages } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event) => {
  const { link, key } = event;
  console.log({ key, link });
  let res = {
    status: "SUCCESS",
  };

  const extractedContent = await extractYoutubeTranscript(link);
  console.log({ extractedContent });

  //Iot
  res = {
    status: ProcessingStages.SUCCESS,
    data: { key, value: extractedContent },
  };
  await publishToTopic(iotClient, key, res);

  return res;
};
