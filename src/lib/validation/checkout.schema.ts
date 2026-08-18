import { z } from "zod";

export const checkoutItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const shippingAddressInputSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's full name."),
  phone: z.string().trim().min(10, "Enter a valid phone number."),
  line1: z.string().trim().min(3, "Enter the address line."),
  line2: z.string().trim().nullable().optional(),
  city: z.string().trim().min(2, "Enter a city."),
  state: z.string().trim().min(2, "Enter a state."),
  postalCode: z.string().trim().min(4, "Enter a valid postal code."),
  country: z.string().trim().min(2, "Enter a country."),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Your cart is empty."),
  shippingAddress: shippingAddressInputSchema,
  couponCode: z.string().trim().optional().nullable(),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressInputSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
