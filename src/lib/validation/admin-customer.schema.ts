import { z } from "zod";

export const updateCustomerBlockedStatusSchema = z.object({
  isBlocked: z.boolean(),
});

export type UpdateCustomerBlockedStatusInput = z.infer<typeof updateCustomerBlockedStatusSchema>;
