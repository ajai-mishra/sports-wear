import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { adminCreateDiscountSchema } from "@/lib/validation/admin-discount.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { createDiscount, listAllDiscounts } from "@/services/discount.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.MARKETING_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  return NextResponse.json(listAllDiscounts());
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
  const parsed = adminCreateDiscountSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const discount = createDiscount(parsed.data);

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "DISCOUNT_CREATED",
    entityType: "Discount",
    entityId: discount.id,
  });

  return NextResponse.json(discount, { status: 201 });
}
