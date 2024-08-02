import { Storage } from "aws-amplify";

  export async function s3UploadUnAuth(file: any, fileName: string) {
    Storage.configure({ level: 'public' });
  
    const stored = await Storage.put(fileName, file, {
      contentType: file.type
    });
    return stored.key;
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

  export const truncate = (input: string) => input.length > 20 ? `${input.substring(0, 20)}...` : input;
