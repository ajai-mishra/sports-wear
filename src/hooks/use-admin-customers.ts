"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { UpdateCustomerBlockedStatusInput } from "@/lib/validation/admin-customer.schema";
import type { UserRole } from "@/types/auth.types";

export const ADMIN_CUSTOMERS_QUERY_KEY = ["admin", "customers"] as const;

/** Shape returned by GET /api/admin/customers (a SafeUserRecord — password omitted). */
export interface AdminCustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isBlocked: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export function useAdminCustomersQuery() {
  return useQuery({
    queryKey: ADMIN_CUSTOMERS_QUERY_KEY,
    queryFn: () => apiClient.get<AdminCustomerRecord[]>("/admin/customers"),
  });
}

export function useUpdateCustomerBlockedStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCustomerBlockedStatusInput }) =>
      apiClient.patch<AdminCustomerRecord>(`/admin/customers/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMERS_QUERY_KEY });
    },
  });
}
