import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest, sessionHasRole } from "@/lib/auth/route-guards";
import { updateOrderStatusSchema } from "@/lib/validation/admin-order.schema";
import { recordAuditLogEntry } from "@/services/audit-log.service";
import { updateOrderStatus } from "@/services/order.service";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.SUPPORT_AGENT, UserRole.ADMIN, UserRole.SUPER_ADMIN];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "Not signed in.");
  }
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    return apiErrorResponse("FORBIDDEN", "You do not have permission to perform this action.");
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const order = updateOrderStatus(id, parsed.data.status, parsed.data.note);
  if (!order) {
    return apiErrorResponse("NOT_FOUND", `No order found with id "${id}".`);
  }

  recordAuditLogEntry({
    actorUserId: session.userId,
    actorName: session.name,
    action: "ORDER_STATUS_UPDATED",
    entityType: "Order",
    entityId: order.id,
  });

  return NextResponse.json(order);
}
