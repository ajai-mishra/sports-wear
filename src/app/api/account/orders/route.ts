import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest } from "@/lib/auth/route-guards";
import { listOrdersForUser } from "@/services/order.service";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }

  return NextResponse.json(listOrdersForUser(session.userId));
}
