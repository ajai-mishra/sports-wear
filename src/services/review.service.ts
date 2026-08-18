import { REVIEWS } from "@/mocks/data/reviews.data";
import { ReviewStatus, type Review } from "@/types/review.types";

export function listApprovedReviewsForProduct(productId: string): Review[] {
  return REVIEWS.filter(
    (review) => review.productId === productId && review.status === ReviewStatus.APPROVED,
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function listAllReviews(): Review[] {
  return REVIEWS;
}

export interface CreateReviewInput {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
}

export function createReview(input: CreateReviewInput): Review {
  const review: Review = {
    id: `review-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    productId: input.productId,
    userId: input.userId,
    userName: input.userName,
    rating: input.rating,
    title: input.title,
    comment: input.comment,
    photoUrls: [],
    status: ReviewStatus.PENDING,
    createdAt: new Date().toISOString(),
  };
  REVIEWS.push(review);
  return review;
}

export function updateReviewStatus(reviewId: string, status: ReviewStatus): Review | null {
  const review = REVIEWS.find((candidate) => candidate.id === reviewId);
  if (!review) return null;
  review.status = status;
  return review;
}
