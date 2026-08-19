"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { AdjustInventoryInput } from "@/lib/validation/admin-inventory.schema";
import type { Product, ProductVariant } from "@/types/product.types";

export const ADMIN_INVENTORY_QUERY_KEY = ["admin", "inventory"] as const;

/** Flattened product/variant row shape returned by GET /api/admin/inventory. */
export interface AdminInventoryRow {
  productId: string;
  productName: string;
  productSlug: string;
  categoryId: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  stockQuantity: number;
  reorderThreshold: number;
}

interface AdjustInventoryResponse {
  product: Product;
  variant: ProductVariant;
}

export function useAdminInventoryQuery() {
  return useQuery({
    queryKey: ADMIN_INVENTORY_QUERY_KEY,
    queryFn: () => apiClient.get<AdminInventoryRow[]>("/admin/inventory"),
  });
}

export function useAdjustInventoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, input }: { variantId: string; input: AdjustInventoryInput }) =>
      apiClient.patch<AdjustInventoryResponse>(`/admin/inventory/${variantId}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_INVENTORY_QUERY_KEY });
    },
  });
}
