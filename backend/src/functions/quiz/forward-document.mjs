import AWS from "aws-sdk";
import { publishToTopic, extractFileName } from "../../utils/helper.mjs";
import { ProcessingStages } from "../../utils/types.mjs";

const { IOT_ENDPOINT, AWS_REGION } = process.env;
const stepfunctions = new AWS.StepFunctions();
const { STATE_MACHINE_ARN } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

export const handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const stateMachineArn = STATE_MACHINE_ARN;
  const params = {
    stateMachineArn,
    input: JSON.stringify({
      Bucket,
      Key,
      source: "s3",
    }),
  };
  console.log({ params });

  //Iot
  const res = {
    status: ProcessingStages.SUCCESS,
    data: { Key, value: null },
  };
  console.log({ fileName: extractFileName(Key) });
  await publishToTopic(iotClient, extractFileName(Key), res);

  //StepFunction
  return stepfunctions
    .startExecution(params)
    .promise()
    .then(() => {
      callback(
        null,
        `Your statemachine ${stateMachineArn} executed successfully for S3 Document`
      );
    })
    .catch((error) => {
      callback(error.message);
    });
};
