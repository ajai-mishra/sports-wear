import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Select a rating.").max(5),
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(80),
  comment: z.string().trim().min(10, "Review must be at least 10 characters.").max(1000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
