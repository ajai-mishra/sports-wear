"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type {
  AdminCreateBannerInput,
  AdminUpdateBannerInput,
} from "@/lib/validation/admin-banner.schema";

export const ADMIN_BANNERS_QUERY_KEY = ["admin", "banners"] as const;

/** Shape returned by GET /api/admin/banners (mirrors the Banner mock record). */
export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export function useAdminBannersQuery() {
  return useQuery({
    queryKey: ADMIN_BANNERS_QUERY_KEY,
    queryFn: () => apiClient.get<AdminBanner[]>("/admin/banners"),
  });
}

export function useCreateBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminCreateBannerInput) => apiClient.post<AdminBanner>("/admin/banners", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BANNERS_QUERY_KEY });
    },
  });
}

export function useUpdateBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AdminUpdateBannerInput }) =>
      apiClient.put<AdminBanner>(`/admin/banners/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BANNERS_QUERY_KEY });
    },
  });
}

export function useDeleteBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ success: boolean }>(`/admin/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BANNERS_QUERY_KEY });
    },
  });
}
