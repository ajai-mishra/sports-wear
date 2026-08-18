import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").optional(),
  phone: z.string().trim().min(10, "Enter a valid phone number.").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
