"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { UpdateStaffRoleInput } from "@/lib/validation/admin-staff.schema";
import type { UserRole } from "@/types/auth.types";

export const ADMIN_STAFF_QUERY_KEY = ["admin", "staff"] as const;

/** Shape returned by GET /api/admin/staff (a SafeUserRecord — password omitted). */
export interface AdminStaffRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isBlocked: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export function useAdminStaffQuery() {
  return useQuery({
    queryKey: ADMIN_STAFF_QUERY_KEY,
    queryFn: () => apiClient.get<AdminStaffRecord[]>("/admin/staff"),
  });
}

export function useUpdateStaffRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStaffRoleInput }) =>
      apiClient.patch<AdminStaffRecord>(`/admin/staff/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_QUERY_KEY });
    },
  });
}
