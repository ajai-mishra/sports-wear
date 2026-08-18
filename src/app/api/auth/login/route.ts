import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { setSessionCookie } from "@/lib/auth/cookie.util";
import { signSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth.schema";
import { toAuthenticatedUser, verifyCredentials } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const user = verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return apiErrorResponse("UNAUTHENTICATED", "Invalid email or password.");
  }

  const authenticatedUser = toAuthenticatedUser(user);
  const token = signSession({
    userId: authenticatedUser.id,
    name: authenticatedUser.name,
    email: authenticatedUser.email,
    role: authenticatedUser.role,
  });

  const response = NextResponse.json({ user: authenticatedUser });
  setSessionCookie(response, token);
  return response;
}
