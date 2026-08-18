"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { selectCartTotalItems, useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";

export function CartButton() {
  const totalItems = useCartStore(selectCartTotalItems);
  const setCartDrawerOpen = useUiStore((state) => state.setCartDrawerOpen);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Open cart, ${totalItems} items`}
      className="relative rounded-full bg-muted/70 hover:bg-primary hover:text-primary-foreground"
      onClick={() => setCartDrawerOpen(true)}
    >
      <ShoppingBag className="size-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground ring-2 ring-background">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Button>
  );
}
