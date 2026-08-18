import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest } from "@/lib/auth/route-guards";
import { updateProfileSchema } from "@/lib/validation/profile.schema";
import { findUserById, updateUserProfile } from "@/services/auth.service";
import type { MockUserRecord } from "@/mocks/data/users.data";

interface AccountProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: MockUserRecord["role"];
}

function toAccountProfile(user: MockUserRecord): AccountProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  const user = findUserById(session.userId);
  if (!user) {
    return apiErrorResponse("UNAUTHENTICATED", "Session is no longer valid.");
  }

  return NextResponse.json({ user: toAccountProfile(user) });
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  const body = await request.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const user = updateUserProfile(session.userId, parsed.data);
  if (!user) {
    return apiErrorResponse("UNAUTHENTICATED", "Session is no longer valid.");
  }

  return NextResponse.json({ user: toAccountProfile(user) });
}
