import { z } from "zod";

import { ReviewStatus } from "@/types/review.types";

export const updateReviewStatusSchema = z.object({
  status: z.enum(ReviewStatus),
});

export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema>;
