import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { updateStaffRoleSchema } from "@/lib/validation/admin-staff.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { toSafeUserRecord, updateUserRole } from "@/services/auth.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.SUPER_ADMIN];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateStaffRoleSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const staffMember = updateUserRole(id, parsed.data.role);
  if (!staffMember) {
    return apiErrorResponse("NOT_FOUND", `No staff member found with id "${id}".`);
  }

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "STAFF_ROLE_UPDATED",
    entityType: "User",
    entityId: staffMember.id,
  });

  return NextResponse.json(toSafeUserRecord(staffMember));
}
