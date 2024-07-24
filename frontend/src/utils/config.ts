/* eslint-disable import/no-anonymous-default-export */
export default {
    MAX_ATTACHMENT_SIZE: 100, //100mb
    S3: {
      REGION: process.env.NEXT_PUBLIC_REGION,
      BUCKET: process.env.NEXT_PUBLIC_BUCKET,
    },
  };
  