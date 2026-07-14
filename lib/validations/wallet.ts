import { z } from "zod";

export const stellarAddressSchema = z
  .string()
  .min(56, "Stellar address must be 56 characters")
  .max(56, "Stellar address must be 56 characters")
  .regex(/^G[A-Z0-9]{55}$/, "Invalid Stellar address format");

export type StellarAddress = z.infer<typeof stellarAddressSchema>;
