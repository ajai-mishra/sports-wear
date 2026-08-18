import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { adminUpdateCategorySchema } from "@/lib/validation/admin-category.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { deleteCategory, updateCategory } from "@/services/category.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.INVENTORY_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];

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
  const parsed = adminUpdateCategorySchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const category = updateCategory(id, parsed.data);
  if (!category) {
    return apiErrorResponse("NOT_FOUND", `No category found with id "${id}".`);
  }

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "CATEGORY_UPDATED",
    entityType: "Category",
    entityId: category.id,
  });

  return NextResponse.json(category);
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
  const wasDeleted = deleteCategory(id);
  if (!wasDeleted) {
    return apiErrorResponse("NOT_FOUND", `No category found with id "${id}".`);
  }

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "CATEGORY_DELETED",
    entityType: "Category",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}
