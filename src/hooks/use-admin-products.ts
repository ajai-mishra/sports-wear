"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type {
  AdminCreateProductInput,
  AdminUpdateProductInput,
} from "@/lib/validation/admin-product.schema";
import type { Product } from "@/types/product.types";

export const ADMIN_PRODUCTS_QUERY_KEY = ["admin", "products"] as const;

export function useAdminProductsQuery() {
  return useQuery({
    queryKey: ADMIN_PRODUCTS_QUERY_KEY,
    queryFn: () => apiClient.get<Product[]>("/admin/products"),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminCreateProductInput) => apiClient.post<Product>("/admin/products", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AdminUpdateProductInput }) =>
      apiClient.put<Product>(`/admin/products/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ success: boolean }>(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}
