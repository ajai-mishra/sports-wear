import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest } from "@/lib/auth/route-guards";
import { createReviewSchema } from "@/lib/validation/review.schema";
import { getProductBySlug } from "@/services/product.service";
import { createReview, listApprovedReviewsForProduct } from "@/services/review.service";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return apiErrorResponse("NOT_FOUND", `No product found with slug "${slug}".`);
  }
  return NextResponse.json(listApprovedReviewsForProduct(product.id));
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "You must be signed in to write a review.");
  }

  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return apiErrorResponse("NOT_FOUND", `No product found with slug "${slug}".`);
  }

  const body = await request.json().catch(() => null);
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const review = createReview({
    productId: product.id,
    userId: session.userId,
    userName: session.name,
    rating: parsed.data.rating,
    title: parsed.data.title,
    comment: parsed.data.comment,
  });

  return NextResponse.json(
    {
      review,
      message: "Thanks for your review — it's pending moderation before it appears publicly.",
    },
    { status: 201 },
  );
}
