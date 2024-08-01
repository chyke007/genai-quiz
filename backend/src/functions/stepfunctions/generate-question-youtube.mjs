import AWS from "aws-sdk";
import {
  publishToTopic,
  getQuestionsFromYoutubeWithBedrock,
  generateSubstringsYoutube,
  scrapeWebsite
} from "../../utils/helper.mjs";
import { ProcessingStages, sourceType } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event) => {
  const { link, key, value } = event.data;
  console.log({ key, link });
  let res = {
    status: ProcessingStages.GENERATING_QUESTIONS
  };
  try {
    console.log({ value });
    const substrings = generateSubstringsYoutube(value);
    console.log({ substrings })

    const questions = await getQuestionsFromYoutubeWithBedrock(substrings)
    const title = (await scrapeWebsite(link)).title;

    await publishToTopic(iotClient, key, res);

    res = {
      status: ProcessingStages.SUCCESS,
      data: { head: link, key, value: questions, source: sourceType.YOUTUBE, title,  content: JSON.stringify(value) }
    };
  } catch (error) {
    console.log({ error })
    res = {
      status: ProcessingStages.ERROR,
      error: "An error occured",
    };
    await publishToTopic(iotClient, key, res);
  }
  return res;
};
