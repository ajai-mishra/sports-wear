import { z } from "zod";

import { AgeGroup } from "@/types/product.types";

export const productImageInputSchema = z.object({
  id: z.string().trim().min(1, "Image id is required."),
  url: z.string().trim().min(1, "Image URL is required."),
  alt: z.string().trim().min(1, "Image alt text is required."),
  sortOrder: z.number().int().min(0),
});

export const productVariantInputSchema = z.object({
  id: z.string().trim().min(1, "Variant id is required."),
  sku: z.string().trim().min(1, "SKU is required."),
  size: z.string().trim().min(1, "Size is required."),
  color: z.string().trim().min(1, "Color is required."),
  colorHex: z.string().trim().min(1, "Color hex is required."),
  ageGroup: z.enum(AgeGroup),
  price: z.number().min(0, "Price must be zero or greater."),
  compareAtPrice: z.number().min(0).nullable(),
  stockQuantity: z.number().int().min(0),
  reorderThreshold: z.number().int().min(0),
  isActive: z.boolean(),
});

export const adminCreateProductSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required."),
  name: z.string().trim().min(2, "Enter a product name."),
  brand: z.string().trim().min(1, "Enter a brand."),
  categoryId: z.string().trim().min(1, "Select a category."),
  shortDescription: z.string().trim().min(1, "Enter a short description."),
  description: z.string().trim().min(1, "Enter a description."),
  sizeGuide: z.string().trim().min(1, "Enter size guide details."),
  images: z.array(productImageInputSchema).min(1, "Add at least one image."),
  variants: z.array(productVariantInputSchema).min(1, "Add at least one variant."),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const adminUpdateProductSchema = adminCreateProductSchema.partial();

export type AdminCreateProductInput = z.infer<typeof adminCreateProductSchema>;
export type AdminUpdateProductInput = z.infer<typeof adminUpdateProductSchema>;
