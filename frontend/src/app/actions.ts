import config from "@/utils/config";

const headers = {
  "x-api-key": `${config.Api.APIKEY}`,
  "Content-Type": "application/json",
};

export const addLink = async ({ type, value }: any) => {
  try {
    const response = await fetch(`${config.Api.ENDPOINT}/add-link`, {
      headers,
      method: "POST",
      body: JSON.stringify({ value }),
    });
    const data = await response.json();
    return res.status(200).json(data);

    console.log({ type, value });

    return res;
  } catch (e) {
    return e;
  }
};
