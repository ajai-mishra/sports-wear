import { z } from "zod";

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1, "Enter a coupon code."),
  subtotal: z.number().min(0, "Subtotal must be zero or greater."),
});

export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
