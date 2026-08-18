import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { setSessionCookie } from "@/lib/auth/cookie.util";
import { signSession } from "@/lib/auth/session";
import { MOCK_OTP_CODE } from "@/lib/constants";
import { verifyOtpSchema } from "@/lib/validation/auth.schema";
import { findUserByEmail, toAuthenticatedUser, verifyEmail } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = verifyOtpSchema.safeParse(body);

  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  if (parsed.data.otp !== MOCK_OTP_CODE) {
    return apiErrorResponse("VALIDATION_ERROR", "Incorrect verification code.");
  }

  const user = findUserByEmail(parsed.data.email);
  if (!user) {
    return apiErrorResponse("NOT_FOUND", "No account found for this email.");
  }

  verifyEmail(user.id);
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
