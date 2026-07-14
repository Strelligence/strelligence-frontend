import { z } from "zod";

export const apiKeySchema = z.object({
  name: z
    .string()
    .min(1, "Key name is required")
    .max(50, "Key name must be 50 characters or less")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Key name can only contain letters, numbers, hyphens, and underscores"
    ),
});

export type ApiKeyFormValues = z.infer<typeof apiKeySchema>;
