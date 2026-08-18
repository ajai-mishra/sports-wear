import { create } from "zustand";
import { persist } from "zustand/middleware";

import { GUEST_CART_STORAGE_KEY } from "@/lib/constants";
import type { CartLineItem } from "@/types/cart.types";

interface CartState {
  items: CartLineItem[];
  addItem: (item: CartLineItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((line) => line.variantId === item.variantId);
          if (!existing) {
            return { items: [...state.items, item] };
          }
          const nextQuantity = Math.min(
            existing.quantity + item.quantity,
            existing.stockQuantity,
          );
          return {
            items: state.items.map((line) =>
              line.variantId === item.variantId ? { ...line, quantity: nextQuantity } : line,
            ),
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((line) => line.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((line) =>
            line.variantId === variantId
              ? { ...line, quantity: Math.max(1, Math.min(quantity, line.stockQuantity)) }
              : line,
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: GUEST_CART_STORAGE_KEY },
  ),
);

export function selectCartTotalItems(state: CartState): number {
  return state.items.reduce((sum, line) => sum + line.quantity, 0);
}

export function selectCartSubtotal(state: CartState): number {
  return state.items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}
