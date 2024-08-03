// app/api/iot/route.ts
import { NextResponse } from "next/server";
import { Iot } from "../../../utils/iot";

// Global mqttClient instance
let mqttClient, subscribeClient;

export async function POST() {
  try {
    if (!mqttClient) {
      mqttClient = await Iot((client) => {
        console.log("Connected to AWS IoT");
        subscribeClient = client;
      });
    }

    return NextResponse.json({ status: "connected" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");

  if (!topic) {
    return NextResponse.json(
      { status: "error", message: "Topic is required" },
      { status: 400 }
    );
  }
  // console.log({ subscribeClient })
  subscribeClient.subscribe(topic);

  try {
    return new Response(
      new ReadableStream({
        start(controller) {
          mqttClient.on("message", (receivedTopic, payload) => {
            if (receivedTopic === topic) {
              controller.enqueue(
                `data: ${JSON.stringify({
                  topic: receivedTopic,
                  message: payload.toString(),
                })}\n\n`
              );
            }
          });
        },
        cancel() {
          console.log("Closing...");
          mqttClient.unsubscribe(topic);
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
