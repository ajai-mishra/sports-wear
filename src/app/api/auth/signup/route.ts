import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { signupSchema } from "@/lib/validation/auth.schema";
import { createCustomer, findUserByEmail } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const existingUser = findUserByEmail(parsed.data.email);
  if (existingUser) {
    return apiErrorResponse("CONFLICT", "An account with this email already exists.");
  }

  const user = createCustomer(parsed.data);

  return NextResponse.json(
    {
      message: "Account created. Enter the verification code sent to your email to continue.",
      email: user.email,
    },
    { status: 201 },
  );
}
