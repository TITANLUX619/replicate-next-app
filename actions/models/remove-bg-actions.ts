'use server'

import { sleep } from "@/lib/utils";
import Replicate, { Prediction } from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;


export async function removeBackground({ image }: RemoveBackgroundProps): ServerActionResult<Prediction> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
    );
  }

  const options: RemoveBackgroundOptions = {
    model: "lucataco/remove-bg",
    version: "95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
    input: {
      image,
    },
  };

  if (WEBHOOK_HOST) {
    options.webhook = `${WEBHOOK_HOST}/api/webhooks`;
    options.webhook_events_filter = ["start", "completed"];
  }

  try {
    let prediction = await replicate.predictions.create(options);

    if (prediction?.error) {
      return { type: "error", message: prediction.error };
    }

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const output = await getPredictionById(prediction.id);

      if (!output) {
        return { type: "error", message: "Prediction not found" };
      }

      prediction = output;
    }
    return { type: "success", message: "Prediction created", data: prediction };


  } catch (error) {
    console.error("Error creating prediction:", error);
    return { type: "error", message: "An unknown error occurred" };
  }
}

export async function getPredictionById(id: string): Promise<Prediction | undefined> {
  const prediction = await replicate.predictions.get(id);

  if (prediction?.error) {
    return
  }

  return prediction
}
