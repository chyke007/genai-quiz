import { fetchFromTableByGS1PK, generateSignedUrl } from "../../utils/helper.mjs";
import { sourceType } from "../../utils/types.mjs";

const { DYNAMODB_NAME } = process.env;

export const handler = async (event) => {
  const { id } = event.pathParameters;

  const PK = `CONTENT#${id}`;

  //find id in db
  let dbResult = await fetchFromTableByGS1PK(DYNAMODB_NAME, PK);
 
  if (dbResult && dbResult.Items.length !== 1) {
    throw Error(`Invalid Id`);
  }

  dbResult = dbResult.Items[0];

  if (dbResult.source === sourceType.S3) {
    const Bucket = dbResult.url.split("/")[0];
    const Key = dbResult.key;

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: dbResult.contentId,
        source: dbResult.source,
        content: {
          title: dbResult.title,
          url: await generateSignedUrl({ Bucket, Key }),
          questions: JSON.parse(dbResult.questions),
        }
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: dbResult.contentId,
      source: dbResult.source,
      content: {
        title: dbResult.title,
        url: dbResult.url,
        questions: JSON.parse(dbResult.questions),
      }
    })
  };
};
