import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest } from "@/lib/auth/route-guards";
import { getOrderForUser } from "@/services/order.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  const { id } = await params;
  const order = getOrderForUser(id, session.userId);
  if (!order) {
    return apiErrorResponse("NOT_FOUND", "No order found with this id.");
  }

  return NextResponse.json(order);
}
