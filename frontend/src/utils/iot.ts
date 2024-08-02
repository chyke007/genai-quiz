/* eslint-disable import/no-anonymous-default-export */

"use server"

import { awsExport } from '@/utils/aws-export';
const AWSIoTData = require('aws-iot-device-sdk')
const AWS = require('aws-sdk')
import config from '@/utils/config';

export default async (callbackOne?: any) => {
  const callme = (client: {
    on(message: string, d: (x: string, y: string) => void): void;
  }, callback: any) => {
    client.on("message", function (topic: string, payload: any) {
      const payloadEnvelope = JSON.parse(payload.toString());

      callback(false)
      switch (payloadEnvelope.status) {
        case "ERROR":
          console.log(payloadEnvelope.data.key);
          break;
        case "SUCCESS":
          console.log("Questions generated successfully!");
          break;
      }
    });
  };
  const AWSConfiguration = {
    poolId: awsExport.Auth.identityPoolId,
    host: config.IoT.ENDPOINT,
    region: awsExport.Auth.region,
  }

  const clientId = 'genaiquiz-' + (Math.floor((Math.random() * 100000) + 1))
  AWS.config.region = AWSConfiguration.region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWSConfiguration.poolId
  })

  const creds = await getCreds();
  
  const mqttClient = AWSIoTData.device({
    region: AWS.config.region,
    host: AWSConfiguration.host,
    clientId: clientId,
    protocol: 'wss',
    maximumReconnectTimeMs: 8000,
    debug: false,
    accessKeyId: creds.Credentials.AccessKeyId,
    secretKey: creds.Credentials.SecretKey,
    sessionToken: creds.Credentials.SessionToken
  })

  mqttClient.on('connect', function () {
    callme(mqttClient, function(data: any){
      callbackOne(data)
    })
    console.log('mqttClient connected')
  })

  return mqttClient;
}

const getCreds = async (): Promise<any> => {
  const cognitoIdentity = new AWS.CognitoIdentity()
  return new Promise((resolve, reject) => {
    AWS.config.credentials.get(function (err: any) {
      if (!err) {
        const params = {
          IdentityId: AWS.config.credentials.identityId
        }
        cognitoIdentity.getCredentialsForIdentity(params, function (err: any, data: any) {
          if (!err) {
            resolve(data)
          } else {
            console.log('Error retrieving credentials: ' + err)
            reject(err)
          }
        })
      } else {
        console.log('Error retrieving identity:' + err)
        reject(err)
      }
    })
  })
}
