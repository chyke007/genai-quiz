import { fetchFromTableBeginsWith } from "../../utils/helper.mjs";

const { DYNAMODB_NAME } = process.env;

export const handler = async (event) => {
  const PK = `RESULT#`;

  //find result in db
  let dbResult = await fetchFromTableBeginsWith(DYNAMODB_NAME, PK);
  if (dbResult && dbResult.Items.length < 1) {
    throw Error(`No Saved Score Available`);
  }

  dbResult = dbResult.Items;

  console.log({ dbResult, len: dbResult.length })

  const data = [];
  for (let i = 0; i < dbResult.length; i++) {
    data.push({
      contentId: dbResult[i].contentId,
      dateTaken: dbResult[i].dateTaken,
      id: dbResult[i].id,
      title: dbResult[i].title,
      correctPoints: dbResult[i].correctPoints,
      totalPoints: dbResult[i].totalPoints,
      score: dbResult[i].score,
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
};
