"use client";

import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { CheckoutInput } from "@/lib/validation/checkout.schema";
import type { ValidateCouponInput } from "@/lib/validation/cart.schema";
import type { Discount } from "@/types/discount.types";
import type { Order } from "@/types/order.types";

interface ValidateCouponResponse {
  discount: Discount;
  discountAmount: number;
}

export function useValidateCouponMutation() {
  return useMutation({
    mutationFn: (input: ValidateCouponInput) =>
      apiClient.post<ValidateCouponResponse>("/cart/validate-coupon", input),
  });
}

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: (input: CheckoutInput) => apiClient.post<{ order: Order }>("/checkout", input),
  });
}
