import type { NextRequest } from "next/server";

import { verifySessionToken } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import type { SessionPayload, UserRole } from "@/types/auth.types";

export function getSessionFromRequest(request: NextRequest): SessionPayload | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function sessionHasRole(
  session: SessionPayload | null,
  allowedRoles: readonly UserRole[],
): boolean {
  return session !== null && allowedRoles.includes(session.role);
}
