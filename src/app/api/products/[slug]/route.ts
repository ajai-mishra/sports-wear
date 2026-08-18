import { NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getProductBySlug, listRelatedProducts, toProductSummary } from "@/services/product.service";
import { getCategoryById } from "@/services/category.service";
import { listApprovedReviewsForProduct } from "@/services/review.service";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return apiErrorResponse("NOT_FOUND", `No product found with slug "${slug}".`);
  }

  const category = getCategoryById(product.categoryId);
  const relatedProducts = listRelatedProducts(product);
  const reviews = listApprovedReviewsForProduct(product.id);

  return NextResponse.json({
    product,
    summary: toProductSummary(product),
    category,
    relatedProducts,
    reviews,
  });
}
