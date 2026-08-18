import { z } from "zod";

export const adminCreateCategorySchema = z.object({
  slug: z.string().trim().min(1, "Slug is required."),
  name: z.string().trim().min(2, "Enter a category name."),
  description: z.string().trim().min(1, "Enter a description."),
  imageUrl: z.string().trim().min(1, "Enter an image URL."),
  parentId: z.string().trim().min(1).nullable(),
});

export const adminUpdateCategorySchema = adminCreateCategorySchema.partial();

export type AdminCreateCategoryInput = z.infer<typeof adminCreateCategorySchema>;
export type AdminUpdateCategoryInput = z.infer<typeof adminUpdateCategorySchema>;
