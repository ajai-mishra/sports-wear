"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { useValidateCouponMutation } from "@/hooks/use-checkout";
import { ApiRequestError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/currency.utils";
import { selectCartSubtotal, useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";

interface AppliedCoupon {
  code: string;
  discountAmount: number;
}

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const couponCodeFromStore = useCheckoutStore((state) => state.couponCode);
  const discountAmountFromStore = useCheckoutStore((state) => state.discountAmount);
  const setCoupon = useCheckoutStore((state) => state.setCoupon);

  const [couponInput, setCouponInput] = useState(couponCodeFromStore ?? "");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    couponCodeFromStore ? { code: couponCodeFromStore, discountAmount: discountAmountFromStore } : null,
  );

  const validateCouponMutation = useValidateCouponMutation();

  const total = Math.max(subtotal - (appliedCoupon?.discountAmount ?? 0), 0);

  async function handleApplyCoupon(event: FormEvent) {
    event.preventDefault();
    setCouponError(null);

    const trimmedCode = couponInput.trim();
    if (!trimmedCode) {
      setCouponError("Enter a coupon code.");
      return;
    }

    try {
      const result = await validateCouponMutation.mutateAsync({ code: trimmedCode, subtotal });
      const normalizedCode = trimmedCode.toUpperCase();
      setAppliedCoupon({ code: normalizedCode, discountAmount: result.discountAmount });
      setCoupon(normalizedCode, result.discountAmount);
      toast.success(`Coupon "${normalizedCode}" applied.`);
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setCouponError(message);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    setCoupon(null, 0);
  }

  if (items.length === 0) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          action={
            <Button render={<Link href="/search" />} nativeButton={false}>
              Continue shopping
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 sm:py-12">
      <h1 className="mb-6 text-2xl font-semibold">Your Cart ({items.length})</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li key={item.variantId}>
              <Card>
                <CardContent className="flex gap-4">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="font-medium hover:underline"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} · Color: {item.color}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${item.productName} from cart`}
                        onClick={() => removeItem(item.variantId)}
                      >
                        <Trash2 />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-input">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Decrease quantity of ${item.productName}`}
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Increase quantity of ${item.productName}`}
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="space-y-4">
              <h2 className="font-semibold">Order Summary</h2>

              <form onSubmit={handleApplyCoupon} className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-md border border-input bg-muted/50 px-2.5 py-1.5 text-sm">
                    <span className="font-medium">{appliedCoupon.code} applied</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Remove coupon"
                      onClick={handleRemoveCoupon}
                    >
                      <X />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      aria-label="Coupon code"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(event) => setCouponInput(event.target.value)}
                    />
                    <Button type="submit" variant="outline" disabled={validateCouponMutation.isPending}>
                      {validateCouponMutation.isPending ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                )}
                {couponError && (
                  <Alert variant="destructive">
                    <AlertDescription>{couponError}</AlertDescription>
                  </Alert>
                )}
              </form>

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-success">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatCurrency(appliedCoupon.discountAmount)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>

              <Button
                className="w-full"
                render={<Link href="/checkout/address" />}
                nativeButton={false}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
