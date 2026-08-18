import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { adminCreateBannerSchema } from "@/lib/validation/admin-banner.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { createBanner, listAllBanners } from "@/services/banner.service";
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

  return NextResponse.json(listAllBanners());
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
  const parsed = adminCreateBannerSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const banner = createBanner(parsed.data);

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "BANNER_CREATED",
    entityType: "Banner",
    entityId: banner.id,
  });

  return NextResponse.json(banner, { status: 201 });
}
