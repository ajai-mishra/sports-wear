import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest } from "@/lib/auth/route-guards";
import { updateAddressSchema } from "@/lib/validation/address.schema";
import { deleteAddress, updateAddress } from "@/services/address.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateAddressSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const address = updateAddress(id, session.userId, parsed.data);
  if (!address) {
    return apiErrorResponse("NOT_FOUND", "No address found with this id.");
  }

  return NextResponse.json(address);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  const { id } = await params;
  const wasDeleted = deleteAddress(id, session.userId);
  if (!wasDeleted) {
    return apiErrorResponse("NOT_FOUND", "No address found with this id.");
  }

  return NextResponse.json({ success: true });
}
