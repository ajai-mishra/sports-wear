"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist.store";
import type { WishlistItem } from "@/types/cart.types";

interface WishlistToggleButtonProps {
  item: WishlistItem;
  className?: string;
}

export function WishlistToggleButton({ item, className }: WishlistToggleButtonProps) {
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(item.productId));
  const toggleItem = useWishlistStore((state) => state.toggleItem);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isInWishlist}
      className={cn("rounded-full shadow-sm", className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleItem(item);
      }}
    >
      <Heart className={cn("size-4", isInWishlist && "fill-primary text-primary")} />
    </Button>
  );
}
