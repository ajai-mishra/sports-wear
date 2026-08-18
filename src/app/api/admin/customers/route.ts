import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { listCustomers, toSafeUserRecord } from "@/services/auth.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.SUPPORT_AGENT, UserRole.ADMIN, UserRole.SUPER_ADMIN];

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  return NextResponse.json(listCustomers().map(toSafeUserRecord));
}
