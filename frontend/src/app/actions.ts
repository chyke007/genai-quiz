"use server";

import config from "@/utils/config";
import { revalidatePath } from "next/cache";

const headers = {
  "x-api-key": `${config.Api.APIKEY}`,
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
};

export async function addLink({ key, link }: any) {
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
}

export async function getQuiz(id: string) {
  try {
    const response = await fetch(`${config.Api.ENDPOINT}/get-question/${id}`, {
      headers,
      method: "GET",
    });
    const data = await response.json();
    revalidatePath("/quiz/[id]", "page");
    return data;
  } catch (e) {
    return e;
  }
}

export async function saveResult({
  id,
  correctPoints,
  totalPoints,
  title,
}: any) {
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
}

export async function getResult() {
  try {
    const response = await fetch(`${config.Api.ENDPOINT}/get-result`, {
      headers,
      method: "GET",
    });
    const data = await response.json();
    revalidatePath("/result");
    return data;
  } catch (e) {
    return e;
  }
}

export async function getAllQuiz(){
  try {
    const response = await fetch(`${config.Api.ENDPOINT}/get-quiz`, {
      headers,
      method: "GET",
    });
    const data = await response.json();
    revalidatePath("/quiz");
    return data;
  } catch (e) {
    return e;
  }
}
