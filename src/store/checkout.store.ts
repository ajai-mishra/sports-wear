import { create } from "zustand";

import type { Address } from "@/types/address.types";

export type DeliveryMethod = "standard" | "express";

interface CheckoutState {
  shippingAddress: Address | null;
  deliveryMethod: DeliveryMethod | null;
  couponCode: string | null;
  discountAmount: number;
  setShippingAddress: (address: Address) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setCoupon: (couponCode: string | null, discountAmount: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  shippingAddress: null,
  deliveryMethod: null,
  couponCode: null,
  discountAmount: 0,
} satisfies Pick<CheckoutState, "shippingAddress" | "deliveryMethod" | "couponCode" | "discountAmount">;

/**
 * Deliberately NOT wrapped in zustand's `persist` middleware — unlike the
 * cart, in-progress checkout state (a partially filled shipping address,
 * a picked delivery method) should not survive a browser restart. It only
 * needs to carry state across the three checkout steps within a session.
 */
export const useCheckoutStore = create<CheckoutState>()((set) => ({
  ...INITIAL_STATE,

  setShippingAddress: (address) => set({ shippingAddress: address }),
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
  setCoupon: (couponCode, discountAmount) => set({ couponCode, discountAmount }),
  reset: () => set({ ...INITIAL_STATE }),
}));
