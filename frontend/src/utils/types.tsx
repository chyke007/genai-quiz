
export enum SourceStages {
    LINK = "link",
    FILE = "file"
  }
  
export enum ProcessingStages {
  UPLOADED = "UPLOADED",
  EXTRACTING_CONTENT = "EXTRACTING_CONTENT",
  GENERATING_QUESTIONS = "GENERATING_QUESTIONS",
  SAVING_IN_DATABASE = "SAVING_IN_DATABASE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}
