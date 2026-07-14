import { z } from "zod";

export const settingsSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .or(z.literal(""))
    .optional(),
  currency: z.enum(["USD", "XLM"]),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
  emailNotifications: z.boolean(),
  alertPrefs: z.object({
    largeTransactions: z.boolean(),
    newSubscriptions: z.boolean(),
    priceAlerts: z.boolean(),
    weeklyReport: z.boolean(),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
