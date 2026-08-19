import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { listAllProductsForAdmin } from "@/services/product.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.INVENTORY_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];

interface InventoryRow {
  productId: string;
  productName: string;
  productSlug: string;
  categoryId: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  stockQuantity: number;
  reorderThreshold: number;
}

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  const inventoryRows: InventoryRow[] = listAllProductsForAdmin().flatMap((product) =>
    product.variants.map((variant) => ({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      categoryId: product.categoryId,
      variantId: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      stockQuantity: variant.stockQuantity,
      reorderThreshold: variant.reorderThreshold,
    })),
  );

  return NextResponse.json(inventoryRows);
}
