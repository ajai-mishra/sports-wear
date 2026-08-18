import { z } from "zod";

import { OrderStatus } from "@/types/order.types";

export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus),
  note: z.string().trim().min(1).optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
