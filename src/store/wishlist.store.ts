import { create } from "zustand";
import { persist } from "zustand/middleware";

import { GUEST_WISHLIST_STORAGE_KEY } from "@/lib/constants";
import type { WishlistItem } from "@/types/cart.types";

interface WishlistState {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((existing) => existing.productId === item.productId);
          if (exists) {
            return { items: state.items.filter((existing) => existing.productId !== item.productId) };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      isInWishlist: (productId) => get().items.some((item) => item.productId === productId),
    }),
    { name: GUEST_WISHLIST_STORAGE_KEY },
  ),
);
