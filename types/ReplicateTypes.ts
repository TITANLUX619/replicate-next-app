declare type WebhookEventType = "start" | "completed";

declare interface PredictionOptions {
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

declare type SendPromptProps = {
  prompt: string;
};

declare type PredictionOutput = string



