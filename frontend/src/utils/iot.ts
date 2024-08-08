"use client";
/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { mqtt5, iot, auth } from "aws-iot-device-sdk-v2";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityCredentials } from "aws-sdk";
import { once } from "events";
import { awsExport } from "@/utils/aws-export";
import config from "@/utils/config";
import { toUtf8 } from "@aws-sdk/util-utf8-browser";

interface AWSCognitoCredentialOptions {
  IdentityPoolId: string;
  Region: string;
}

class AWSCognitoCredentialsProvider extends auth.CredentialsProvider {
  private options: AWSCognitoCredentialOptions;
  private cachedCredentials?: CognitoIdentityCredentials;

  constructor(
    options: AWSCognitoCredentialOptions,
    expire_interval_in_ms?: number
  ) {
    super();
    this.options = options;

    setInterval(async () => {
      await this.refreshCredentials();
    }, expire_interval_in_ms ?? 3600 * 1000);
  }

  getCredentials(): auth.AWSCredentials {
    return {
      aws_access_id: this.cachedCredentials?.accessKeyId ?? "",
      aws_secret_key: this.cachedCredentials?.secretAccessKey ?? "",
      aws_sts_token: this.cachedCredentials?.sessionToken,
      aws_region: this.options.Region,
    };
  }

  async refreshCredentials() {
    console.log("Fetching Cognito credentials");
    this.cachedCredentials = await fromCognitoIdentityPool({
      // Required. The unique identifier for the identity pool from which an identity should be
      // retrieved or generated.
      identityPoolId: this.options.IdentityPoolId,
      clientConfig: { region: this.options.Region },
    })();
  }
}

function createClient(
  provider: AWSCognitoCredentialsProvider,
  toaster, setToaster, forceRefresh
): mqtt5.Mqtt5Client {
  let wsConfig: iot.WebsocketSigv4Config = {
    credentialsProvider: provider,
    region: config.Cognito.REGION,
  };

  let builder: iot.AwsIotMqtt5ClientConfigBuilder =
    iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
      config.IoT.ENDPOINT,
      wsConfig
    );

  let client: mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());

  client.on("error", (error) => {
    console.log("Error event: " + error.toString());
    forceRefresh();
  });

  client.on(
    "attemptingConnect",
    (eventData: mqtt5.AttemptingConnectEvent) => {
      console.log("Attempting Connect event");
      setToaster({
        message: "Attempting Connection with AWS IoT",
        toaster: toaster.toaster + 1,
        type: "info",
      });
    }
  );

  client.on(
    "connectionSuccess",
    (eventData: mqtt5.ConnectionSuccessEvent) => {
      setToaster({
        message: "Connection established with AWS IoT",
        toaster: toaster.toaster + 1,
        type: "success",
      });
      console.log("Connack: " + JSON.stringify(eventData.connack));
      console.log("Settings: " + JSON.stringify(eventData.settings));
    }
  );

  client.on(
    "connectionFailure",
    (eventData: mqtt5.ConnectionFailureEvent) => {
      console.log("Connection failure event: " + eventData.error.toString());
      forceRefresh();
    }
  );

  client.on("disconnection", (eventData: mqtt5.DisconnectionEvent) => {
    console.log("Disconnection event: " + eventData.error.toString());
    if (eventData.disconnect !== undefined) {
      console.log(
        "Disconnect packet: " + JSON.stringify(eventData.disconnect)
      );
    }
  });

  client.on("stopped", (eventData: mqtt5.StoppedEvent) => {
    console.log("Stopped event");
  });
  return client;
}

export const Iot = async (callme: any, toaster, setToaster, forceRefresh) => {
  /** Set up the credentialsProvider */
  const provider = new AWSCognitoCredentialsProvider({
    IdentityPoolId: config.Cognito.IDENTITY_POOL_ID,
    Region: config.Cognito.REGION,
  });
  /** Make sure the credential provider fetched before setup the connection */
  await provider.refreshCredentials();

  let client: mqtt5.Mqtt5Client = createClient(provider, toaster, setToaster, forceRefresh);

  const attemptingConnect = once(client, "attemptingConnect");
  const connectionSuccess = once(client, "connectionSuccess");

  client.start();

  await attemptingConnect;
  await connectionSuccess;
  callme(client);
};

export const subscribe = async (client: mqtt5.Mqtt5Client, topic: string) => {
  await client.subscribe({
    subscriptions: [{ qos: mqtt5.QoS.AtLeastOnce, topicFilter: topic }],
  });
};
