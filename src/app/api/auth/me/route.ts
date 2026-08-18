import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest } from "@/lib/auth/route-guards";
import { findUserById, toAuthenticatedUser } from "@/services/auth.service";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  const user = findUserById(session.userId);
  if (!user) {
    return apiErrorResponse("UNAUTHENTICATED", "Session is no longer valid.");
  }

  return NextResponse.json({ user: toAuthenticatedUser(user) });
}
