import { z } from "zod";

export const adminCreateBannerSchema = z.object({
  title: z.string().trim().min(2, "Enter a title."),
  subtitle: z.string().trim().min(1, "Enter a subtitle."),
  ctaLabel: z.string().trim().min(1, "Enter a CTA label."),
  ctaHref: z.string().trim().min(1, "Enter a CTA link."),
  imageUrl: z.string().trim().min(1, "Enter an image URL."),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const adminUpdateBannerSchema = adminCreateBannerSchema.partial();

export type AdminCreateBannerInput = z.infer<typeof adminCreateBannerSchema>;
export type AdminUpdateBannerInput = z.infer<typeof adminUpdateBannerSchema>;
