import { ReviewStatus, type Review } from "@/types/review.types";
import { PRODUCTS } from "@/mocks/data/products.data";
import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";
import { createSeededRandom, pickInt, pickOne } from "@/mocks/data/seeded-random.util";

const REVIEWER_NAMES = [
  "Aarav Sharma",
  "Priya Nair",
  "Rohan Mehta",
  "Ananya Iyer",
  "Vikram Singh",
  "Sneha Reddy",
  "Karan Kapoor",
  "Divya Menon",
  "Arjun Rao",
  "Ishita Gupta",
];

const REVIEW_TITLES_BY_RATING: Record<number, string[]> = {
  5: ["Excellent quality", "Exceeded expectations", "Perfect fit and finish"],
  4: ["Really good, minor niggles", "Solid choice", "Happy with this purchase"],
  3: ["Decent for the price", "It's okay", "Does the job"],
};

const REVIEW_COMMENTS_BY_RATING: Record<number, string[]> = {
  5: [
    "Fits exactly as described and the material feels premium. Wore it for a full training week and it held up great.",
    "Ordered based on the size guide and it was spot on. Will be buying more colors.",
    "Great value for the quality — comfortable even after long sessions.",
  ],
  4: [
    "Good product overall, sizing runs slightly large so keep that in mind.",
    "Comfortable and durable, docking one star only because delivery took longer than expected.",
    "Works well for my training needs, colour is slightly different from the photos.",
  ],
  3: [
    "It's fine for the price but I expected slightly better stitching.",
    "Average — does what it says but nothing exceptional.",
    "Reasonable quality, would consider sizing up next time.",
  ],
};

function buildReviewsForProduct(productId: string, seed: number): Review[] {
  const random = createSeededRandom(seed);
  const reviewCount = pickInt(random, 2, 5);

  return Array.from({ length: reviewCount }, (_, index) => {
    const rating = pickOne(random, [5, 5, 4, 4, 3] as const);
    return {
      id: `${productId}-review-${index + 1}`,
      productId,
      userId: `mock-reviewer-${pickInt(random, 1, 500)}`,
      userName: pickOne(random, REVIEWER_NAMES),
      rating,
      title: pickOne(random, REVIEW_TITLES_BY_RATING[rating]),
      comment: pickOne(random, REVIEW_COMMENTS_BY_RATING[rating]),
      photoUrls: [],
      status: ReviewStatus.APPROVED,
      createdAt: new Date(2025, pickInt(random, 0, 11), pickInt(random, 1, 28)).toISOString(),
    };
  });
}

export const REVIEWS: Review[] = getOrCreateGlobalSingleton("reviews", () =>
  PRODUCTS.flatMap((product, index) => buildReviewsForProduct(product.id, 5000 + index * 17)),
);
