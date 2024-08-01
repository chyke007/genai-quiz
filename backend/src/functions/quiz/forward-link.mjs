import AWS from "aws-sdk";
import { publishToTopic } from "../../utils/helper.mjs";
import { ProcessingStages } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;
const stepfunctions = new AWS.StepFunctions();
const { STATE_MACHINE_ARN } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const link = body.link;
  const key = body.key;

  const stateMachineArn = STATE_MACHINE_ARN;
  const params = {
    stateMachineArn,
    input: JSON.stringify({
      source: "youtube",
      link,
      key,
    }),
  };

  console.log({ params });
  const res = {
    status: ProcessingStages.SUCCESS,
    data: { link, key },
  };
  console.log({ key });

  await publishToTopic(iotClient, key, res);
  return stepfunctions
    .startExecution(params)
    .promise()
    .then(() => {
      callback(
        null,
        `Your statemachine ${stateMachineArn} executed successfully for YouTube link`
      );
    })
    .catch((error) => {
      callback(error.message);
    });
};
