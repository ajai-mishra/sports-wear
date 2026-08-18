"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist.store";

export function WishlistButton() {
  const totalItems = useWishlistStore((state) => state.items.length);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={`Open wishlist, ${totalItems} items`}
      render={<Link href="/wishlist" />}
      nativeButton={false}
    >
      <Heart className="size-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Button>
  );
}
