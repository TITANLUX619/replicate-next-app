import { NextResponse } from "next/server";
import Replicate from "replicate";

type WebhookEventType = "start" | "completed";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

interface PredictionOptions {
  model: string;
  version?: string;
  input: {
    prompt: string,
    guidance: number,
    num_outputs: number,
    aspect_ratio: string,
    output_format: string,
    output_quality: number,
    prompt_strength: number,
    num_inference_steps: number
  };
  webhook?: string;
  webhook_events_filter?: WebhookEventType[];
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
    );
  }

  const { prompt } = await request.json() as { prompt: string };

  const options: PredictionOptions = {
    model: "black-forest-labs/flux-dev",
    input: {
      prompt,
      guidance: 3.5,
      num_outputs: 2,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      prompt_strength: 0.8,
      num_inference_steps: 28,
    },
  };

  if (WEBHOOK_HOST) {
    options.webhook = `${WEBHOOK_HOST}/api/webhooks`;
    options.webhook_events_filter = ["start", "completed"]; // Uso de WebhookEventType[]
  }

  try {
    const prediction = await replicate.predictions.create(options);

    if (prediction?.error) {
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error("Error creating prediction:", error);
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 });
  }
}
