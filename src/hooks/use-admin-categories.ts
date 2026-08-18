"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type {
  AdminCreateCategoryInput,
  AdminUpdateCategoryInput,
} from "@/lib/validation/admin-category.schema";
import type { Category } from "@/types/category.types";

export const ADMIN_CATEGORIES_QUERY_KEY = ["admin", "categories"] as const;

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_QUERY_KEY,
    queryFn: () => apiClient.get<Category[]>("/admin/categories"),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminCreateCategoryInput) => apiClient.post<Category>("/admin/categories", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AdminUpdateCategoryInput }) =>
      apiClient.put<Category>(`/admin/categories/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ success: boolean }>(`/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
    },
  });
}
