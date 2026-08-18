"use client";

import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { CreateReviewInput } from "@/lib/validation/review.schema";
import type { Review } from "@/types/review.types";

export function useCreateReviewMutation(productSlug: string) {
  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      apiClient.post<{ review: Review; message: string }>(`/products/${productSlug}/reviews`, input),
  });
}
