"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type {
  AdminCreateDiscountInput,
  AdminUpdateDiscountInput,
} from "@/lib/validation/admin-discount.schema";
import type { Discount } from "@/types/discount.types";

export const ADMIN_DISCOUNTS_QUERY_KEY = ["admin", "discounts"] as const;

export function useAdminDiscountsQuery() {
  return useQuery({
    queryKey: ADMIN_DISCOUNTS_QUERY_KEY,
    queryFn: () => apiClient.get<Discount[]>("/admin/discounts"),
  });
}

export function useCreateDiscountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminCreateDiscountInput) => apiClient.post<Discount>("/admin/discounts", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DISCOUNTS_QUERY_KEY });
    },
  });
}

export function useUpdateDiscountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AdminUpdateDiscountInput }) =>
      apiClient.put<Discount>(`/admin/discounts/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DISCOUNTS_QUERY_KEY });
    },
  });
}

export function useDeleteDiscountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ success: boolean }>(`/admin/discounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_DISCOUNTS_QUERY_KEY });
    },
  });
}
