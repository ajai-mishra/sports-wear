import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { listCustomers } from "@/services/auth.service";
import { getCategoryById } from "@/services/category.service";
import { listAllOrders } from "@/services/order.service";
import { getProductById, listAllProductsForAdmin } from "@/services/product.service";
import { UserRole } from "@/types/auth.types";
import { PaymentStatus } from "@/types/order.types";

const ALLOWED_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

interface LowStockVariantRow {
  productName: string;
  variantId: string;
  sku: string;
  stockQuantity: number;
  reorderThreshold: number;
}

interface TopProductByReviewsRow {
  productName: string;
  reviewCount: number;
  rating: number;
}

interface CategoryRevenueRow {
  categoryName: string;
  revenue: number;
}

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  const orders = listAllOrders();
  const products = listAllProductsForAdmin();

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, order) => sum + order.total, 0);

  const totalOrders = orders.length;
  const totalCustomers = listCustomers().length;

  const lowStockVariants: LowStockVariantRow[] = products.flatMap((product) =>
    product.variants
      .filter((variant) => variant.stockQuantity <= variant.reorderThreshold)
      .map((variant) => ({
        productName: product.name,
        variantId: variant.id,
        sku: variant.sku,
        stockQuantity: variant.stockQuantity,
        reorderThreshold: variant.reorderThreshold,
      })),
  );

  const topProductsByReviews: TopProductByReviewsRow[] = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5)
    .map((product) => ({
      productName: product.name,
      reviewCount: product.reviewCount,
      rating: product.rating,
    }));

  const revenueByCategoryId = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      const product = getProductById(item.productId);
      if (!product) continue;
      const currentRevenue = revenueByCategoryId.get(product.categoryId) ?? 0;
      revenueByCategoryId.set(product.categoryId, currentRevenue + item.unitPrice * item.quantity);
    }
  }

  const revenueByCategory: CategoryRevenueRow[] = [...revenueByCategoryId.entries()]
    .map(([categoryId, revenue]) => ({
      categoryName: getCategoryById(categoryId)?.name ?? "Unknown Category",
      revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    lowStockVariants,
    topProductsByReviews,
    revenueByCategory,
  });
}
