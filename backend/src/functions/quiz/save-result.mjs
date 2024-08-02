import { dayjs, generateUuid, saveToTable } from "../../utils/helper.mjs";

const { DYNAMODB_NAME } = process.env;

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const dateNow = dayjs().toDate().toISOString();
  const uuid = generateUuid();

  if (
    !("id" in body) ||
    !("correctPoints" in body) ||
    !("totalPoints" in body) ||
    !("title" in body)
  ) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Missing fields",
      }),
    };
  }

  const { id, title, correctPoints, totalPoints } = body

  let tableContent = {
    PK: `RESULT#`,
    SK: `${dateNow}#${uuid}`,
    id: uuid,
    contentId: id,
    title,
    correctPoints,
    totalPoints,
    score: (Number(correctPoints) / Number(totalPoints)) * 100,
    dateTaken: dateNow
  };

  await saveToTable(DYNAMODB_NAME, tableContent);

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: dbResult.contentId,
      source: dbResult.source,
      content: {
        title: dbResult.title,
        url: dbResult.url,
        questions: JSON.parse(dbResult.questions),
      },
    }),
  };
};
