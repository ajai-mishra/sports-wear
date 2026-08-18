"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { PageContainer } from "@/components/shared/page-container";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/constants";
import { formatCurrency } from "@/lib/currency.utils";
import { useCheckoutStore, type DeliveryMethod } from "@/store/checkout.store";

/**
 * Delivery method here is descriptive only. The real shipping fee is always
 * computed server-side by POST /api/checkout from the free-shipping
 * threshold — the mock endpoint has no parameter for delivery method, so
 * picking "Express" does not change what gets charged. This is a deliberate
 * simplification of this mock stage, not a bug.
 */
const EXPRESS_SURCHARGE_NOTE = "Client-side estimate only — not charged by checkout in this mock stage.";

export default function CheckoutDeliveryPage() {
  const router = useRouter();
  const shippingAddress = useCheckoutStore((state) => state.shippingAddress);
  const deliveryMethodFromStore = useCheckoutStore((state) => state.deliveryMethod);
  const setDeliveryMethod = useCheckoutStore((state) => state.setDeliveryMethod);

  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod>(deliveryMethodFromStore ?? "standard");

  useEffect(() => {
    if (!shippingAddress) {
      router.replace("/checkout/address");
    }
  }, [shippingAddress, router]);

  if (!shippingAddress) {
    return null;
  }

  function handleContinue() {
    setDeliveryMethod(selectedMethod);
    router.push("/checkout/payment");
  }

  return (
    <PageContainer className="py-8 sm:py-12">
      <div className="mb-8">
        <CheckoutSteps currentStep="delivery" />
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold">Delivery Method</h1>

        <Card>
          <CardContent>
            <RadioGroup
              value={selectedMethod}
              onValueChange={(value) => setSelectedMethod(value as DeliveryMethod)}
              aria-label="Delivery method"
            >
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                  selectedMethod === "standard" ? "border-primary bg-primary/5" : "border-input"
                }`}
              >
                <RadioGroupItem value="standard" className="mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Standard (3–5 business days)</p>
                  <p className="text-sm text-muted-foreground">
                    Free over {formatCurrency(FREE_SHIPPING_THRESHOLD)}, {formatCurrency(STANDARD_SHIPPING_FEE)}{" "}
                    otherwise.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                  selectedMethod === "express" ? "border-primary bg-primary/5" : "border-input"
                }`}
              >
                <RadioGroupItem value="express" className="mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Express (1–2 business days)</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(199)} flat.</p>
                  <p className="mt-1 text-xs text-muted-foreground">{EXPRESS_SURCHARGE_NOTE}</p>
                </div>
              </label>
            </RadioGroup>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleContinue}>
          Continue to Payment
        </Button>
      </div>
    </PageContainer>
  );
}
