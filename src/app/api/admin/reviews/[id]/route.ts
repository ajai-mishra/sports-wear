import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { updateReviewStatusSchema } from "@/lib/validation/admin-review.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { updateReviewStatus } from "@/services/review.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.SUPPORT_AGENT, UserRole.ADMIN, UserRole.SUPER_ADMIN];

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
  const parsed = updateReviewStatusSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const review = updateReviewStatus(id, parsed.data.status);
  if (!review) {
    return apiErrorResponse("NOT_FOUND", `No review found with id "${id}".`);
  }

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "REVIEW_STATUS_UPDATED",
    entityType: "Review",
    entityId: review.id,
  });

  return NextResponse.json(review);
}
