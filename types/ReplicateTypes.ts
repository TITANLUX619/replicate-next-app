declare type WebhookEventType = "start" | "completed";

declare type SendPromptProps = {
  prompt: string;
};

declare type PredictionOutput = string

declare interface GenerateImageOptions {
  model: string;
  version?: string;
  input: {
    prompt: string;
    guidance: number;
    num_outputs: number;
    aspect_ratio: string;
    output_format: string;
    output_quality: number;
    prompt_strength: number;
    num_inference_steps: number;
  };
  webhook?: string;
  webhook_events_filter?: WebhookEventType[];
}

declare type RemoveBackgroundProps = {
  image: string;
}

declare type RemoveBackgroundOptions = {
  model: string;
  version?: string;
  input: {
    image: string;
  };
  webhook?: string;
  webhook_events_filter?: WebhookEventType[];
};



