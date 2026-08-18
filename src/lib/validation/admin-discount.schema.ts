import { z } from "zod";

import { DiscountScope, DiscountType } from "@/types/discount.types";

export const adminCreateDiscountSchema = z.object({
  name: z.string().trim().min(2, "Enter a discount name."),
  type: z.enum(DiscountType),
  scope: z.enum(DiscountScope),
  targetId: z.string().trim().min(1).nullable(),
  value: z.number().min(0, "Value must be zero or greater."),
  couponCode: z.string().trim().min(1).nullable(),
  maxRedemptions: z.number().int().min(1).nullable(),
  startsAt: z.string().trim().min(1, "Provide a start date."),
  endsAt: z.string().trim().min(1, "Provide an end date."),
  isActive: z.boolean().default(true),
});

export const adminUpdateDiscountSchema = adminCreateDiscountSchema.partial();

export type AdminCreateDiscountInput = z.infer<typeof adminCreateDiscountSchema>;
export type AdminUpdateDiscountInput = z.infer<typeof adminUpdateDiscountSchema>;
