import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { adminUpdateDiscountSchema } from "@/lib/validation/admin-discount.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { deleteDiscount, updateDiscount } from "@/services/discount.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.MARKETING_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = adminUpdateDiscountSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const discount = updateDiscount(id, parsed.data);
  if (!discount) {
    return apiErrorResponse("NOT_FOUND", `No discount found with id "${id}".`);
  }

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "DISCOUNT_UPDATED",
    entityType: "Discount",
    entityId: discount.id,
  });

  return NextResponse.json(discount);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  const { id } = await params;
  const wasDeleted = deleteDiscount(id);
  if (!wasDeleted) {
    return apiErrorResponse("NOT_FOUND", `No discount found with id "${id}".`);
  }

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "DISCOUNT_DELETED",
    entityType: "Discount",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}
