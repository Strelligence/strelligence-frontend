import { z } from "zod";

export const webhookSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL format")
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("http://"),
      "URL must start with http:// or https://"
    ),
  events: z
    .array(z.string())
    .min(1, "Select at least one event"),
});

export type WebhookFormValues = z.infer<typeof webhookSchema>;
