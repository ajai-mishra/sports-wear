"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/currency.utils";
import { selectCartSubtotal, useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";

export function CartDrawer() {
  const isOpen = useUiStore((state) => state.isCartDrawerOpen);
  const setOpen = useUiStore((state) => state.setCartDrawerOpen);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button
              size="sm"
              render={<Link href="/search" />}
              nativeButton={false}
              onClick={() => setOpen(false)}
            >
              Start shopping
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-4">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image src={item.imageUrl} alt={item.productName} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-1 text-sm font-medium hover:underline"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.size} · {item.color}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-input">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus />
                        </Button>
                        <span className="w-5 text-center text-sm">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${item.productName} from cart`}
                    onClick={() => removeItem(item.variantId)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>

            <SheetFooter className="border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and discounts calculated at checkout.</p>
              <Button render={<Link href="/cart" />} nativeButton={false} onClick={() => setOpen(false)}>
                View Cart & Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
