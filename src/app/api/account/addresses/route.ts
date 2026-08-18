import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest } from "@/lib/auth/route-guards";
import { addressInputSchema } from "@/lib/validation/address.schema";
import { createAddress, listAddressesForUser } from "@/services/address.service";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  return NextResponse.json(listAddressesForUser(session.userId));
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  const body = await request.json().catch(() => null);
  const parsed = addressInputSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const address = createAddress({ ...parsed.data, userId: session.userId });
  return NextResponse.json(address, { status: 201 });
}
