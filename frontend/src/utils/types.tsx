export enum SourceStages {
  LINK = "link",
  FILE = "file",
}

export enum ProcessingStages {
  UPLOADED = "UPLOADED",
  EXTRACTING_CONTENT = "EXTRACTING_CONTENT",
  GENERATING_QUESTIONS = "GENERATING_QUESTIONS",
  SAVING_IN_DATABASE = "SAVING_IN_DATABASE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export type CredentialType = {
  aws_access_id: string | undefined;
  aws_secret_key: string | undefined;
  aws_sts_token: string | undefined;
  aws_region: string | undefined;
};
