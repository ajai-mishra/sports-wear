import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { adjustInventorySchema } from "@/lib/validation/admin-inventory.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { adjustVariantStock } from "@/services/product.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.INVENTORY_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];

interface RouteParams {
  params: Promise<{ variantId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  const { variantId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = adjustInventorySchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const match = adjustVariantStock(variantId, parsed.data.stockQuantity);
  if (!match) {
    return apiErrorResponse("NOT_FOUND", `No product variant found with id "${variantId}".`);
  }

  // AuditLogEntry has no dedicated note field, so the adjustment reason is
  // folded into the action string to keep every stock change auditable.
  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: `STOCK_ADJUSTED: ${parsed.data.reason}`,
    entityType: "ProductVariant",
    entityId: variantId,
  });

  return NextResponse.json(match);
}
