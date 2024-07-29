import { uploadData } from "aws-amplify/storage";

export async function s3UploadUnAuth(
    file: any,
    fileName: string,
    callback: any
  ) {
    const stored = await uploadData({
      key: fileName,
      data: file,
      options: {
        accessLevel: "guest",
        onProgress: callback
      },
    });
    return (await stored.result).key;
  }
  
  export function replaceSpacesWithHyphens(filename: string) {
    return filename.replace(/\s/g, "-");
  }
  
  export const sleep = async (ms: number) =>
    new Promise((r) => setTimeout(r, ms));
  
  export const isYouTubeLink = (str: string) => {
    // Regular expression for a valid YouTube URL
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(embed\/|v\/|watch\?v=)|youtu\.be\/)/;
  
    // Test if the string matches the YouTube URL pattern
    return youtubeRegex.test(str);
  };
