"use strict";
const AWS = require("aws-sdk");
const stepfunctions = new AWS.StepFunctions();
const { STATE_MACHINE_ARN } = process.env;
// const { NO_EMAIL_FOUND } = require('../../utils/constant');
const { publishToTopic, extractFileName } = require("../../utils/helper");
const { ProcessingStages } = require("../../utils/types");
const { IOT_ENDPOINT, AWS_REGION } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

module.exports.handler = async (event, context, callback) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const stateMachineArn = STATE_MACHINE_ARN;
  const params = {
    stateMachineArn,
    input: JSON.stringify({
      bucket,
      key,
      source: "s3",
    }),
  };
  console.log({ params });

  //Iot
  const res = {
    status: ProcessingStages.SUCCESS,
    data: { key, value: null },
  };
  console.log({ fileName: extractFileName(key) });
  await publishToTopic(iotClient, extractFileName(key), res);

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
