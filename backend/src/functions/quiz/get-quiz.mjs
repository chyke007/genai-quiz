import { fetchFromTableByPK } from "../../utils/helper.mjs";

const { DYNAMODB_NAME } = process.env;

export const handler = async () => {
  const PK = `CONTENT#public`;

  //find result in db
  let dbResult = await fetchFromTableByPK(DYNAMODB_NAME, PK);
  if (dbResult && dbResult.Items.length < 1) {
    throw Error(`No Quiz Available`);
  }

  dbResult = dbResult.Items;

  const data = [];
  for (let i = 0; i < dbResult.length; i++) {
    data.push({
      contentId: dbResult[i].contentId,
      dateCreated: dbResult[i].dateCreated,
      title: dbResult[i].title
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
};
