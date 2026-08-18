"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { FormField } from "@/components/shared/form-field";
import { PageContainer } from "@/components/shared/page-container";
import { useAddresses } from "@/hooks/use-account";
import { useSession } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { shippingAddressInputSchema, type ShippingAddressInput } from "@/lib/validation/checkout.schema";
import { useCheckoutStore } from "@/store/checkout.store";
import type { Address } from "@/types/address.types";

export default function CheckoutAddressPage() {
  const router = useRouter();
  const { data: user } = useSession();
  const { data: savedAddresses } = useAddresses();
  const setShippingAddress = useCheckoutStore((state) => state.setShippingAddress);
  const storedAddress = useCheckoutStore((state) => state.shippingAddress);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(storedAddress?.id ?? null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressInputSchema),
    defaultValues: storedAddress ?? { country: "India" },
  });

  function handleSelectSavedAddress(address: Address) {
    setSelectedAddressId(address.id);
    reset({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
  }

  function onSubmit(data: ShippingAddressInput) {
    // A placeholder id is used here — the mock /api/checkout endpoint ignores
    // whatever id/userId/isDefault a client sends and creates its own address
    // record server-side, so there's no need for this draft id to be unique
    // (and no need for a Date.now()/crypto call, which the render-purity lint
    // rule rightly flags inside a component).
    setShippingAddress({
      id: "addr-checkout-draft",
      userId: user?.id ?? "",
      isDefault: false,
      ...data,
      line2: data.line2 ?? null,
    });
    router.push("/checkout/delivery");
  }

  return (
    <PageContainer className="py-8 sm:py-12">
      <div className="mb-8">
        <CheckoutSteps currentStep="address" />
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold">Shipping Address</h1>

        {savedAddresses && savedAddresses.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Saved addresses</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {savedAddresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => handleSelectSavedAddress(address)}
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition-colors hover:border-primary",
                    selectedAddressId === address.id ? "border-primary bg-primary/5" : "border-input",
                  )}
                >
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-muted-foreground">
                    {address.line1}, {address.city}, {address.state} {address.postalCode}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <FormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
                <Input id="fullName" aria-invalid={!!errors.fullName} {...register("fullName")} />
              </FormField>

              <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
                <Input id="phone" type="tel" aria-invalid={!!errors.phone} {...register("phone")} />
              </FormField>

              <FormField label="Address line 1" htmlFor="line1" error={errors.line1?.message}>
                <Input id="line1" aria-invalid={!!errors.line1} {...register("line1")} />
              </FormField>

              <FormField label="Address line 2 (optional)" htmlFor="line2" error={errors.line2?.message}>
                <Input id="line2" aria-invalid={!!errors.line2} {...register("line2")} />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="City" htmlFor="city" error={errors.city?.message}>
                  <Input id="city" aria-invalid={!!errors.city} {...register("city")} />
                </FormField>
                <FormField label="State" htmlFor="state" error={errors.state?.message}>
                  <Input id="state" aria-invalid={!!errors.state} {...register("state")} />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Postal code" htmlFor="postalCode" error={errors.postalCode?.message}>
                  <Input id="postalCode" aria-invalid={!!errors.postalCode} {...register("postalCode")} />
                </FormField>
                <FormField label="Country" htmlFor="country" error={errors.country?.message}>
                  <Input id="country" aria-invalid={!!errors.country} {...register("country")} />
                </FormField>
              </div>

              <Button type="submit" className="w-full">
                Continue to Delivery
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
