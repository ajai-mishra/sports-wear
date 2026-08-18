"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdminCategoriesQuery } from "@/hooks/use-admin-categories";
import { useCreateProductMutation, useUpdateProductMutation } from "@/hooks/use-admin-products";
import { ApiRequestError } from "@/lib/api-client";
import {
  productImageInputSchema,
  productVariantInputSchema,
  type AdminCreateProductInput,
} from "@/lib/validation/admin-product.schema";
import { AgeGroup, type Product } from "@/types/product.types";

// A standalone schema (not `adminCreateProductSchema.omit(...)`) on purpose:
// every field here is required with no `z.default(...)`, which keeps the
// resolver's input and output types identical and avoids the
// optional-vs-required generic mismatch `.default()` fields cause with
// zodResolver + useForm. The nested array schemas are still reused directly
// from admin-product.schema.ts so image/variant validation never drifts from
// what the API enforces.
//
// The admin never types a slug directly (it isn't part of this form's field
// list) — it's derived from the name on create, and left untouched on edit.
// It's re-attached in onSubmit; the API route still validates the full
// adminCreateProductSchema server-side.
const productFormSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name."),
  brand: z.string().trim().min(1, "Enter a brand."),
  categoryId: z.string().trim().min(1, "Select a category."),
  shortDescription: z.string().trim().min(1, "Enter a short description."),
  description: z.string().trim().min(1, "Enter a description."),
  sizeGuide: z.string().trim().min(1, "Enter size guide details."),
  images: z.array(productImageInputSchema).min(1, "Add at least one image."),
  variants: z.array(productVariantInputSchema).min(1, "Add at least one variant."),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});
type ProductFormValues = z.infer<typeof productFormSchema>;

const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: AgeGroup.KIDS, label: "Kids" },
  { value: AgeGroup.TEEN, label: "Teen" },
  { value: AgeGroup.ADULT, label: "Adult" },
];

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function createEmptyImage(): ProductFormValues["images"][number] {
  return { id: crypto.randomUUID(), url: "", alt: "", sortOrder: 0 };
}

function createEmptyVariant(): ProductFormValues["variants"][number] {
  return {
    id: crypto.randomUUID(),
    sku: `SKU-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    size: "",
    color: "",
    colorHex: "#000000",
    ageGroup: AgeGroup.ADULT,
    price: 0,
    compareAtPrice: null,
    stockQuantity: 0,
    reorderThreshold: 0,
    isActive: true,
  };
}

function toFormValues(product?: Product): ProductFormValues {
  if (!product) {
    return {
      name: "",
      brand: "",
      categoryId: "",
      shortDescription: "",
      description: "",
      sizeGuide: "",
      images: [createEmptyImage()],
      variants: [createEmptyVariant()],
      rating: 0,
      reviewCount: 0,
      isFeatured: false,
      isActive: true,
    };
  }
  return {
    name: product.name,
    brand: product.brand,
    categoryId: product.categoryId,
    shortDescription: product.shortDescription,
    description: product.description,
    sizeGuide: product.sizeGuide,
    images: product.images,
    variants: product.variants,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
  };
}

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = product !== undefined;
  const { data: categories } = useAdminCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toFormValues(product),
  });

  const imageFields = useFieldArray({ control, name: "images" });
  const variantFields = useFieldArray({ control, name: "variants" });

  async function onSubmit(data: ProductFormValues) {
    const payload: AdminCreateProductInput = {
      ...data,
      slug: isEditMode ? product.slug : slugify(data.name),
      images: data.images.map((image, index) => ({ ...image, sortOrder: index })),
    };

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({ id: product.id, input: payload });
        toast.success("Product updated.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Product created.");
      }
      router.push("/admin/products");
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      setError("root", { message });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8 pb-16">
      {errors.root && (
        <p className="text-sm text-destructive" role="alert">
          {errors.root.message}
        </p>
      )}

      <section className="space-y-4 rounded-xl border border-border p-4">
        <h2 className="font-medium">Details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
          </FormField>

          <FormField label="Brand" htmlFor="brand" error={errors.brand?.message}>
            <Input id="brand" aria-invalid={!!errors.brand} {...register("brand")} />
          </FormField>
        </div>

        <FormField label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="categoryId" className="w-full" aria-invalid={!!errors.categoryId}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {(categories ?? []).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Short description" htmlFor="shortDescription" error={errors.shortDescription?.message}>
          <Input id="shortDescription" aria-invalid={!!errors.shortDescription} {...register("shortDescription")} />
        </FormField>

        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" rows={4} aria-invalid={!!errors.description} {...register("description")} />
        </FormField>

        <FormField label="Size guide" htmlFor="sizeGuide" error={errors.sizeGuide?.message}>
          <Textarea id="sizeGuide" rows={3} aria-invalid={!!errors.sizeGuide} {...register("sizeGuide")} />
        </FormField>

        <div className="flex flex-wrap gap-8">
          <Controller
            control={control}
            name="isFeatured"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch id="isFeatured" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            )}
          />
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="isActive">Active</Label>
              </div>
            )}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Images</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageFields.append(createEmptyImage())}
          >
            <Plus /> Add image
          </Button>
        </div>
        {errors.images?.message && (
          <p className="text-sm text-destructive" role="alert">
            {errors.images.message}
          </p>
        )}

        <div className="space-y-3">
          {imageFields.fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <FormField
                  label="Image URL"
                  htmlFor={`images.${index}.url`}
                  error={errors.images?.[index]?.url?.message}
                >
                  <Input
                    id={`images.${index}.url`}
                    aria-invalid={!!errors.images?.[index]?.url}
                    {...register(`images.${index}.url` as const)}
                  />
                </FormField>
                <FormField
                  label="Alt text"
                  htmlFor={`images.${index}.alt`}
                  error={errors.images?.[index]?.alt?.message}
                >
                  <Input
                    id={`images.${index}.alt`}
                    aria-invalid={!!errors.images?.[index]?.alt}
                    {...register(`images.${index}.alt` as const)}
                  />
                </FormField>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove image ${index + 1}`}
                disabled={imageFields.fields.length <= 1}
                onClick={() => imageFields.remove(index)}
                className="mt-6"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Variants</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => variantFields.append(createEmptyVariant())}
          >
            <Plus /> Add variant
          </Button>
        </div>
        {errors.variants?.message && (
          <p className="text-sm text-destructive" role="alert">
            {errors.variants.message}
          </p>
        )}

        <div className="space-y-4">
          {variantFields.fields.map((field, index) => {
            const variantErrors = errors.variants?.[index];
            return (
              <div key={field.id} className="space-y-3 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Variant {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove variant ${index + 1}`}
                    disabled={variantFields.fields.length <= 1}
                    onClick={() => variantFields.remove(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <FormField label="Size" htmlFor={`variants.${index}.size`} error={variantErrors?.size?.message}>
                    <Input
                      id={`variants.${index}.size`}
                      aria-invalid={!!variantErrors?.size}
                      {...register(`variants.${index}.size` as const)}
                    />
                  </FormField>
                  <FormField label="Color" htmlFor={`variants.${index}.color`} error={variantErrors?.color?.message}>
                    <Input
                      id={`variants.${index}.color`}
                      aria-invalid={!!variantErrors?.color}
                      {...register(`variants.${index}.color` as const)}
                    />
                  </FormField>
                  <FormField
                    label="Color hex"
                    htmlFor={`variants.${index}.colorHex`}
                    error={variantErrors?.colorHex?.message}
                  >
                    <Input
                      id={`variants.${index}.colorHex`}
                      aria-invalid={!!variantErrors?.colorHex}
                      {...register(`variants.${index}.colorHex` as const)}
                    />
                  </FormField>
                </div>

                <FormField label="Age group" htmlFor={`variants.${index}.ageGroup`}>
                  <Controller
                    control={control}
                    name={`variants.${index}.ageGroup` as const}
                    render={({ field: ageGroupField }) => (
                      <Select value={ageGroupField.value} onValueChange={ageGroupField.onChange}>
                        <SelectTrigger id={`variants.${index}.ageGroup`} className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AGE_GROUP_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <div className="grid gap-3 sm:grid-cols-4">
                  <FormField label="Price" htmlFor={`variants.${index}.price`} error={variantErrors?.price?.message}>
                    <Input
                      id={`variants.${index}.price`}
                      type="number"
                      min={0}
                      step="0.01"
                      aria-invalid={!!variantErrors?.price}
                      {...register(`variants.${index}.price` as const, { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Compare-at price"
                    htmlFor={`variants.${index}.compareAtPrice`}
                    error={variantErrors?.compareAtPrice?.message}
                  >
                    <Controller
                      control={control}
                      name={`variants.${index}.compareAtPrice` as const}
                      render={({ field: compareField }) => (
                        <Input
                          id={`variants.${index}.compareAtPrice`}
                          type="number"
                          min={0}
                          step="0.01"
                          value={compareField.value ?? ""}
                          onChange={(event) =>
                            compareField.onChange(event.target.value === "" ? null : Number(event.target.value))
                          }
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Stock quantity"
                    htmlFor={`variants.${index}.stockQuantity`}
                    error={variantErrors?.stockQuantity?.message}
                  >
                    <Input
                      id={`variants.${index}.stockQuantity`}
                      type="number"
                      min={0}
                      step="1"
                      aria-invalid={!!variantErrors?.stockQuantity}
                      {...register(`variants.${index}.stockQuantity` as const, { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Reorder threshold"
                    htmlFor={`variants.${index}.reorderThreshold`}
                    error={variantErrors?.reorderThreshold?.message}
                  >
                    <Input
                      id={`variants.${index}.reorderThreshold`}
                      type="number"
                      min={0}
                      step="1"
                      aria-invalid={!!variantErrors?.reorderThreshold}
                      {...register(`variants.${index}.reorderThreshold` as const, { valueAsNumber: true })}
                    />
                  </FormField>
                </div>

                <Controller
                  control={control}
                  name={`variants.${index}.isActive` as const}
                  render={({ field: activeField }) => (
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`variants.${index}.isActive`}
                        checked={activeField.value}
                        onCheckedChange={activeField.onChange}
                      />
                      <Label htmlFor={`variants.${index}.isActive`}>Active</Label>
                    </div>
                  )}
                />
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" /> : null}
          {isEditMode ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
