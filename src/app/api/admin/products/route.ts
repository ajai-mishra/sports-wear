import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { adminCreateProductSchema } from "@/lib/validation/admin-product.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { createProduct, listAllProductsForAdmin } from "@/services/product.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.INVENTORY_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  return NextResponse.json(listAllProductsForAdmin());
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  const body = await request.json().catch(() => null);
  const parsed = adminCreateProductSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const product = createProduct(parsed.data);

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "PRODUCT_CREATED",
    entityType: "Product",
    entityId: product.id,
  });

  return NextResponse.json(product, { status: 201 });
}
