import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { forgotPasswordSchema } from "@/lib/validation/auth.schema";

// Always responds with the same generic message regardless of whether the
// email exists — enumerating registered emails through this endpoint is a
// common account-takeover reconnaissance vector.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  return NextResponse.json({
    message: "If an account exists for this email, a verification code has been sent.",
  });
}
