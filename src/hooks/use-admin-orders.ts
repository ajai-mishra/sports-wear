"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { UpdateOrderStatusInput } from "@/lib/validation/admin-order.schema";
import type { Order } from "@/types/order.types";

export const ADMIN_ORDERS_QUERY_KEY = ["admin", "orders"] as const;

export function useAdminOrdersQuery() {
  return useQuery({
    queryKey: ADMIN_ORDERS_QUERY_KEY,
    queryFn: () => apiClient.get<Order[]>("/admin/orders"),
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrderStatusInput }) =>
      apiClient.patch<Order>(`/admin/orders/${id}/status`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
    },
  });
}
