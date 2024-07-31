import config from "@/utils/config";

const headers = {
  "x-api-key": `${config.Api.APIKEY}`,
  "Content-Type": "application/json",
};

export const addLink = async ({ key, link }: any) => {
  try {
    const response = await fetch(`${config.Api.ENDPOINT}/add-link`, {
      headers,
      method: "POST",
      body: JSON.stringify({ link, key }),
    });
    const data = await response.json();
    return data;
  } catch (e) {
    return e;
  }
};
