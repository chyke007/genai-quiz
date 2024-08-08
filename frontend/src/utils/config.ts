/* eslint-disable import/no-anonymous-default-export */
export default {
    MAX_ATTACHMENT_SIZE: 100, //100mb
    S3: {
      REGION: process.env.NEXT_PUBLIC_REGION,
      BUCKET: process.env.NEXT_PUBLIC_BUCKET,
    },

    Cognito: {
        REGION: process.env.NEXT_PUBLIC_REGION || "us-east-1",
        USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID || "id",
        APP_CLIENT_ID: process.env.NEXT_PUBLIC_APP_CLIENT_ID || "id",
        IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "id",
    },
    IoT: {
        ENDPOINT: process.env.NEXT_PUBLIC_IOT_ENDPOINT || "endpoint",
        YOUTUBE_VIDEO_PROCESSED: "YOUTUBE_VIDEO_PROCESSED",
        PDF_PROCESSED: "PDF_PROCESSED",
        QUESTION_GENERATED: "QUESTION_GENERATED"
    },
    Api: {
        ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
        ENDPOINT_GATEWAY: process.env.NEXT_PUBLIC_API_ENDPOINT_GATEWAY,
        APIKEY:  process.env.NEXT_PUBLIC_API_KEY
    }
  };
  