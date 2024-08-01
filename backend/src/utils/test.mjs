import { YoutubeTranscript } from 'youtube-transcript';
import TranscriptAPI from 'youtube-transcript-api';
const MAX_MINS = 60;


(async () => {
    const extractVideoId = (url)  => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const matches = url.match(regex);
        return matches ? matches[1] : null;
      }
      
    const extractYoutubeTranscript = async (youtubeVideoUrl) => {
        const transcript = await TranscriptAPI.getTranscript(extractVideoId(youtubeVideoUrl));
      
        const maxSeconds = MAX_MINS * 60 * 1000;
        let totalSeconds = 0;
        let extractedTranscript = [];
        console.log({ transcript });
      
        for (const entry of transcript) {
          const entryDuration = entry.duration || 0;
          totalSeconds += entryDuration;
      
          if (totalSeconds <= maxSeconds) {
            extractedTranscript.push({
              duration: entry.duration,
              offset: entry.start,
              text: entry.text.replace(/\s+/g, " ").trim(),
            });
          } else {
            break;
          }
        }
      
        return extractedTranscript;
      };

    try{
        const res = await extractYoutubeTranscript("https://www.youtube.com/watch?v=ZdjFqPwlmLU");
        console.log(res);
    }catch(error){
        console.log({ error });
    }
    
})();
