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

export const getQuiz = async (id: string) => {
  try {
    const response = await fetch(`${config.Api.ENDPOINT}/get-question/${id}`, {
      headers,
      method: "GET"
    });
    const data = await response.json();
    return data;
  } catch (e) {
    return e;
  }
}

export const saveResult = async ({ id, correctPoints, totalPoints, title }: any) => {
  try {
    const response = await fetch(`${config.Api.ENDPOINT}/save-result`, {
      headers,
      method: "POST",
      body: JSON.stringify({ id, correctPoints, totalPoints, title }),
    });
    const data = await response.json();
    return data;
  } catch (e) {
    return e;
  }
};

export const getResult = async () => {
  try {
    const response = await fetch(`${config.Api.ENDPOINT}/get-result`, {
      headers,
      method: "GET"
    });
    const data = await response.json();
    return data;
  } catch (e) {
    return e;
  }
}
