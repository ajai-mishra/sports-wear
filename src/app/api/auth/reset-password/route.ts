import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { MOCK_OTP_CODE } from "@/lib/constants";
import { resetPasswordSchema } from "@/lib/validation/auth.schema";
import { findUserByEmail, updatePassword } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);

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

  updatePassword(user.id, parsed.data.newPassword);

  return NextResponse.json({ message: "Password updated. You can now sign in." });
}
