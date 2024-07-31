const AWS = require("aws-sdk");
const stepfunctions = new AWS.StepFunctions();
const { STATE_MACHINE_ARN } = process.env;
// const { NO_EMAIL_FOUND } = require('../../utils/constant');
const { publishToTopic } = require("../../utils/helper");
const { ProcessingStages } = require("../../utils/types");
const { IOT_ENDPOINT, AWS_REGION } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

module.exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const link = body.link;
  const key = body.key

  const stateMachineArn = STATE_MACHINE_ARN;
  const params = {
    stateMachineArn,
    input: JSON.stringify({
      source: 'youtube',
      link,
      key
    }),
  };

  console.log({params})
  const res = {
    status: ProcessingStages.SUCCESS,
    data: { link, key },
  };
  console.log({ key })

  await publishToTopic(iotClient, key, res);
  return stepfunctions.startExecution(params).promise().then(() => {
    callback(null, `Your statemachine ${stateMachineArn} executed successfully for YouTube link`);
  }).catch(error => {
    callback(error.message);
  });
  };
