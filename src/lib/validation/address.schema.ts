import { z } from "zod";

export const addressInputSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's full name."),
  phone: z.string().trim().min(10, "Enter a valid phone number."),
  line1: z.string().trim().min(3, "Enter the address line."),
  line2: z.string().trim().nullable().default(null),
  city: z.string().trim().min(2, "Enter a city."),
  state: z.string().trim().min(2, "Enter a state."),
  postalCode: z.string().trim().min(4, "Enter a valid postal code."),
  country: z.string().trim().min(2, "Enter a country."),
  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = addressInputSchema.partial();

export type AddressInput = z.infer<typeof addressInputSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

/**
 * The pre-parse shape react-hook-form should use as its field values: line2
 * and isDefault carry `.default(...)` in the schema, which zod only applies
 * on the *output* side, so react-hook-form's live form state (input side)
 * still sees them as optional. Pair with `AddressInput` as the resolver's
 * `TTransformedValues` generic so the submit handler still receives the
 * fully-defaulted output shape.
 */
export type AddressFormInput = z.input<typeof addressInputSchema>;
