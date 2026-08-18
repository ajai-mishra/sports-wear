"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/shared/form-field";
import { useCreateAddressMutation, useUpdateAddressMutation } from "@/hooks/use-account";
import { ApiRequestError } from "@/lib/api-client";
import {
  addressInputSchema,
  type AddressFormInput,
  type AddressInput,
} from "@/lib/validation/address.schema";
import type { Address } from "@/types/address.types";

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
}

const EMPTY_ADDRESS_VALUES: AddressFormInput = {
  fullName: "",
  phone: "",
  line1: "",
  line2: null,
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

function toFormValues(address?: Address | null): AddressFormInput {
  if (!address) return EMPTY_ADDRESS_VALUES;
  return {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
  };
}

export function AddressFormDialog({ open, onOpenChange, address }: AddressFormDialogProps) {
  const isEditMode = Boolean(address);
  const createAddressMutation = useCreateAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const isPending = createAddressMutation.isPending || updateAddressMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddressFormInput, unknown, AddressInput>({
    resolver: zodResolver(addressInputSchema),
    defaultValues: EMPTY_ADDRESS_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(address));
    }
  }, [open, address, reset]);

  async function onSubmit(data: AddressInput) {
    try {
      if (isEditMode && address) {
        await updateAddressMutation.mutateAsync({ id: address.id, input: data });
        toast.success("Address updated.");
      } else {
        await createAddressMutation.mutateAsync(data);
        toast.success("Address added.");
      }
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit address" : "Add address"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

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
            <Input id="line2" {...register("line2")} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="City" htmlFor="city" error={errors.city?.message}>
              <Input id="city" aria-invalid={!!errors.city} {...register("city")} />
            </FormField>
            <FormField label="State" htmlFor="state" error={errors.state?.message}>
              <Input id="state" aria-invalid={!!errors.state} {...register("state")} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Postal code" htmlFor="postalCode" error={errors.postalCode?.message}>
              <Input id="postalCode" aria-invalid={!!errors.postalCode} {...register("postalCode")} />
            </FormField>
            <FormField label="Country" htmlFor="country" error={errors.country?.message}>
              <Input id="country" aria-invalid={!!errors.country} {...register("country")} />
            </FormField>
          </div>

          <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isDefault"
                  checked={field.value ?? false}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEditMode ? "Save changes" : "Add address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
