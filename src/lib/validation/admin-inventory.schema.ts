import { z } from "zod";

export const adjustInventorySchema = z.object({
  stockQuantity: z.number().int().min(0, "Stock quantity must be zero or greater."),
  reason: z.string().trim().min(3, "Provide a reason for this adjustment."),
});

export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema>;
