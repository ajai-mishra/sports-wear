"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { PageContainer } from "@/components/shared/page-container";
import { useCheckoutMutation } from "@/hooks/use-checkout";
import { ApiRequestError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/currency.utils";
import { selectCartSubtotal, useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";

type PaymentMethod = "card" | "upi" | "netbanking";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "Credit / Debit Card",
  upi: "UPI",
  netbanking: "Net Banking",
};

const PAYMENT_METHODS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[];

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const shippingAddress = useCheckoutStore((state) => state.shippingAddress);
  const deliveryMethod = useCheckoutStore((state) => state.deliveryMethod);
  const couponCode = useCheckoutStore((state) => state.couponCode);
  const discountAmount = useCheckoutStore((state) => state.discountAmount);
  const resetCheckout = useCheckoutStore((state) => state.reset);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const checkoutMutation = useCheckoutMutation();

  // Placing an order successfully calls resetCheckout(), which nulls
  // shippingAddress while this page is still mounted (router.push to the
  // confirmation page is not synchronous). Without this flag, the guard
  // effect below would see the now-null address and redirect back to
  // /checkout/address, racing against — and winning over — the pending
  // navigation to the confirmation page.
  const hasPlacedOrderRef = useRef(false);

  useEffect(() => {
    if (!shippingAddress && !hasPlacedOrderRef.current) {
      router.replace("/checkout/address");
    }
  }, [shippingAddress, router]);

  if (!shippingAddress) {
    return null;
  }

  const estimatedTotal = Math.max(subtotal - discountAmount, 0);

  async function handlePlaceOrder() {
    setSubmitError(null);
    try {
      const { order } = await checkoutMutation.mutateAsync({
        items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        shippingAddress: {
          fullName: shippingAddress!.fullName,
          phone: shippingAddress!.phone,
          line1: shippingAddress!.line1,
          line2: shippingAddress!.line2,
          city: shippingAddress!.city,
          state: shippingAddress!.state,
          postalCode: shippingAddress!.postalCode,
          country: shippingAddress!.country,
        },
        couponCode,
      });
      hasPlacedOrderRef.current = true;
      clearCart();
      resetCheckout();
      router.push(`/checkout/confirmation/${order.id}`);
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setSubmitError(message);
    }
  }

  return (
    <PageContainer className="py-8 sm:py-12">
      <div className="mb-8">
        <CheckoutSteps currentStep="payment" />
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold">Payment</h1>

        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-medium">Order Summary</h2>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.variantId} className="flex items-center justify-between text-sm">
                  <span>
                    {item.productName} ({item.size}/{item.color}) × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <Separator />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between text-success">
                  <span>Discount ({couponCode})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Shipping fee is calculated at checkout based on order value.
              </p>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Estimated Total</span>
              <span>{formatCurrency(estimatedTotal)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2">
            <h2 className="font-medium">Shipping To</h2>
            <p className="text-sm">{shippingAddress.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {shippingAddress.line1}
              {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ""}, {shippingAddress.city},{" "}
              {shippingAddress.state} {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <p className="text-sm text-muted-foreground">{shippingAddress.phone}</p>
            {deliveryMethod && (
              <p className="text-sm">
                Delivery: <span className="font-medium capitalize">{deliveryMethod}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <h2 className="font-medium">Payment Method</h2>
            <p className="text-xs text-muted-foreground">
              This is a frontend mock stage — no real payment gateway is integrated yet. Placing an order
              simply confirms the mock checkout.
            </p>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              aria-label="Payment method"
            >
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    paymentMethod === method ? "border-primary bg-primary/5" : "border-input"
                  }`}
                >
                  <RadioGroupItem value={method} />
                  <span className="text-sm font-medium">{PAYMENT_METHOD_LABELS[method]}</span>
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handlePlaceOrder} disabled={checkoutMutation.isPending}>
          {checkoutMutation.isPending ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </PageContainer>
  );
}
