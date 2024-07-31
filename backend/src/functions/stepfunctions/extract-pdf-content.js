const AWS = require("aws-sdk");
// const { NO_EMAIL_FOUND } = require('../../utils/constant');
const { publishToTopic, extractFileName } = require("../../utils/helper");
const { ProcessingStages } = require("../../utils/types");
const { IOT_ENDPOINT, AWS_REGION } = process.env;

AWS.config.update({ region: AWS_REGION });
const iotClient = new AWS.IotData({ endpoint: IOT_ENDPOINT });

module.exports.handler = async (event, context, callback) => {
  const { bucket, key } = event;
  console.log({ key, bucket });
  let res = {
    status: "SUCCESS",
  };
  
  //Iot
  res = {
    status: ProcessingStages.SUCCESS,
    data: { key, value: null },
  };
  console.log({ key, bucket });
  await publishToTopic(iotClient, extractFileName(key), res);

  return res;
};
