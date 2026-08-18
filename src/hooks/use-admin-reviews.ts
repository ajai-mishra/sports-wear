"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { UpdateReviewStatusInput } from "@/lib/validation/admin-review.schema";
import type { PaginatedResult, ProductSummary } from "@/types/product.types";
import type { Review } from "@/types/review.types";

export const ADMIN_REVIEWS_QUERY_KEY = ["admin", "reviews"] as const;
const PRODUCT_NAME_LOOKUP_QUERY_KEY = ["admin", "reviews", "product-lookup"] as const;

/** Large enough to cover the full mock catalog in a single page for the lookup below. */
const PRODUCT_LOOKUP_PAGE_SIZE = 200;

export function useAdminReviewsQuery() {
  return useQuery({
    queryKey: ADMIN_REVIEWS_QUERY_KEY,
    queryFn: () => apiClient.get<Review[]>("/admin/reviews"),
  });
}

export function useUpdateReviewStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReviewStatusInput }) =>
      apiClient.patch<Review>(`/admin/reviews/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_QUERY_KEY });
    },
  });
}

/**
 * Reviews only carry a raw `productId` (see src/types/review.types.ts) — this
 * does a one-time client-side fetch of the public product catalog to build a
 * `Map<productId, productName>` lookup for display, without touching the
 * reviews API response shape.
 */
export function useProductNameLookupQuery() {
  return useQuery({
    queryKey: PRODUCT_NAME_LOOKUP_QUERY_KEY,
    queryFn: async (): Promise<Map<string, string>> => {
      const result = await apiClient.get<PaginatedResult<ProductSummary>>(
        `/products?pageSize=${PRODUCT_LOOKUP_PAGE_SIZE}`,
      );
      return new Map(result.data.map((product) => [product.id, product.name]));
    },
  });
}
