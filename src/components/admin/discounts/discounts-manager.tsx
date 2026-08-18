"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useAdminDiscountsQuery,
  useCreateDiscountMutation,
  useDeleteDiscountMutation,
  useUpdateDiscountMutation,
} from "@/hooks/use-admin-discounts";
import { ApiRequestError } from "@/lib/api-client";
import { type AdminCreateDiscountInput } from "@/lib/validation/admin-discount.schema";
import { DiscountScope, DiscountType, type Discount } from "@/types/discount.types";
import { z } from "zod";

const TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
  { value: DiscountType.PERCENTAGE, label: "Percentage" },
  { value: DiscountType.FLAT, label: "Flat amount" },
];

const SCOPE_OPTIONS: { value: DiscountScope; label: string }[] = [
  { value: DiscountScope.STOREWIDE, label: "Storewide" },
  { value: DiscountScope.CATEGORY, label: "Category" },
  { value: DiscountScope.PRODUCT, label: "Product" },
];

// Mirrors admin-discount.schema.ts's adminCreateDiscountSchema exactly, minus
// `isActive`'s `.default(true)`. A schema with `.default(...)` makes that
// field optional on its *input* type while `z.infer` (used for
// AdminCreateDiscountInput) reflects the required *output* type — that split
// is exactly what zodResolver + useForm can't reconcile into one generic.
// Every field here is required on both sides, so it type-checks cleanly.
const discountFormSchema = z.object({
  name: z.string().trim().min(2, "Enter a discount name."),
  type: z.enum(DiscountType),
  scope: z.enum(DiscountScope),
  targetId: z.string().trim().min(1).nullable(),
  value: z.number().min(0, "Value must be zero or greater."),
  couponCode: z.string().trim().min(1).nullable(),
  maxRedemptions: z.number().int().min(1).nullable(),
  startsAt: z.string().trim().min(1, "Provide a start date."),
  endsAt: z.string().trim().min(1, "Provide an end date."),
  isActive: z.boolean(),
});

function toDateInputValue(isoString: string): string {
  return isoString ? isoString.slice(0, 10) : "";
}

function toIsoString(dateInputValue: string): string {
  return new Date(`${dateInputValue}T00:00:00.000Z`).toISOString();
}

function toFormValues(discount?: Discount): AdminCreateDiscountInput {
  if (!discount) {
    return {
      name: "",
      type: DiscountType.PERCENTAGE,
      scope: DiscountScope.STOREWIDE,
      targetId: null,
      value: 0,
      couponCode: null,
      maxRedemptions: null,
      startsAt: toDateInputValue(new Date().toISOString()),
      endsAt: toDateInputValue(new Date().toISOString()),
      isActive: true,
    };
  }
  return {
    name: discount.name,
    type: discount.type,
    scope: discount.scope,
    targetId: discount.targetId,
    value: discount.value,
    couponCode: discount.couponCode,
    maxRedemptions: discount.maxRedemptions,
    startsAt: toDateInputValue(discount.startsAt),
    endsAt: toDateInputValue(discount.endsAt),
    isActive: discount.isActive,
  };
}

interface DiscountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount: Discount | null;
}

function DiscountFormDialog({ open, onOpenChange, discount }: DiscountFormDialogProps) {
  const isEditMode = discount !== null;
  const createMutation = useCreateDiscountMutation();
  const updateMutation = useUpdateDiscountMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError,
  } = useForm<AdminCreateDiscountInput>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: toFormValues(discount ?? undefined),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(discount ?? undefined));
    }
  }, [open, discount, reset]);

  const scopeValue = watch("scope");
  const typeValue = watch("type");

  async function onSubmit(data: AdminCreateDiscountInput) {
    const payload: AdminCreateDiscountInput = {
      ...data,
      targetId: data.scope === DiscountScope.STOREWIDE ? null : data.targetId,
      startsAt: toIsoString(data.startsAt),
      endsAt: toIsoString(data.endsAt),
    };

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({ id: discount.id, input: payload });
        toast.success("Discount updated.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Discount created.");
      }
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      setError("root", { message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit discount" : "New discount"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update this discount's rules." : "Create a new discount or coupon."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          {errors.root && (
            <p className="text-sm text-destructive" role="alert">
              {errors.root.message}
            </p>
          )}

          <FormField label="Name" htmlFor="discount-name" error={errors.name?.message}>
            <Input id="discount-name" aria-invalid={!!errors.name} {...register("name")} />
          </FormField>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Type" htmlFor="discount-type">
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="discount-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Scope" htmlFor="discount-scope">
              <Controller
                control={control}
                name="scope"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="discount-scope" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCOPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          {scopeValue !== DiscountScope.STOREWIDE && (
            <FormField
              label={scopeValue === DiscountScope.CATEGORY ? "Target category id" : "Target product id"}
              htmlFor="discount-target"
              error={errors.targetId?.message}
              description="The id of the category or product this discount applies to."
            >
              <Input id="discount-target" {...register("targetId")} value={watch("targetId") ?? ""} />
            </FormField>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              label={typeValue === DiscountType.PERCENTAGE ? "Value (%)" : "Value"}
              htmlFor="discount-value"
              error={errors.value?.message}
            >
              <Input
                id="discount-value"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={!!errors.value}
                {...register("value", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Coupon code (optional)" htmlFor="discount-coupon">
              <Controller
                control={control}
                name="couponCode"
                render={({ field }) => (
                  <Input
                    id="discount-coupon"
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value === "" ? null : event.target.value)}
                  />
                )}
              />
            </FormField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Starts on" htmlFor="discount-starts" error={errors.startsAt?.message}>
              <Input id="discount-starts" type="date" aria-invalid={!!errors.startsAt} {...register("startsAt")} />
            </FormField>
            <FormField label="Ends on" htmlFor="discount-ends" error={errors.endsAt?.message}>
              <Input id="discount-ends" type="date" aria-invalid={!!errors.endsAt} {...register("endsAt")} />
            </FormField>
          </div>

          <FormField label="Max redemptions (optional)" htmlFor="discount-max-redemptions">
            <Controller
              control={control}
              name="maxRedemptions"
              render={({ field }) => (
                <Input
                  id="discount-max-redemptions"
                  type="number"
                  min={1}
                  step="1"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(event.target.value === "" ? null : Number(event.target.value))
                  }
                />
              )}
            />
          </FormField>

          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch id="discount-active" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="discount-active">Active</Label>
              </div>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : null}
              {isEditMode ? "Save changes" : "Create discount"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DiscountsManager() {
  const { data: discounts, isLoading, isError } = useAdminDiscountsQuery();
  const deleteMutation = useDeleteDiscountMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [deletingDiscount, setDeletingDiscount] = useState<Discount | null>(null);

  function openCreateDialog() {
    setEditingDiscount(null);
    setIsFormOpen(true);
  }

  function openEditDialog(discount: Discount) {
    setEditingDiscount(discount);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deletingDiscount) return;
    try {
      await deleteMutation.mutateAsync(deletingDiscount.id);
      toast.success("Discount deleted.");
      setDeletingDiscount(null);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Discounts</h1>
          <p className="text-sm text-muted-foreground">Manage storewide, category, and product discounts.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus /> New Discount
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading discounts...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load discounts.</p>}

      {discounts && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Coupon</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No discounts yet.
                  </TableCell>
                </TableRow>
              )}
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">{discount.name}</TableCell>
                  <TableCell className="text-muted-foreground">{discount.type}</TableCell>
                  <TableCell className="text-muted-foreground">{discount.scope}</TableCell>
                  <TableCell>
                    {discount.type === DiscountType.PERCENTAGE ? `${discount.value}%` : discount.value}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{discount.couponCode ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {format(new Date(discount.startsAt), "MMM d, yyyy")} –{" "}
                    {format(new Date(discount.endsAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={discount.isActive ? "default" : "outline"}>
                      {discount.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${discount.name}`}
                        onClick={() => openEditDialog(discount)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${discount.name}`}
                        onClick={() => setDeletingDiscount(discount)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DiscountFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} discount={editingDiscount} />

      <Dialog open={deletingDiscount !== null} onOpenChange={(open) => !open && setDeletingDiscount(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete discount?</DialogTitle>
            <DialogDescription>
              This will permanently remove &ldquo;{deletingDiscount?.name}&rdquo;. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingDiscount(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
