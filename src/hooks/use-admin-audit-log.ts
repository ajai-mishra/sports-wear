"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

export const ADMIN_AUDIT_LOG_QUERY_KEY = ["admin", "audit-log"] as const;

/** Shape of one entry returned by GET /api/admin/audit-log (already reverse-chronological). */
export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  occurredAt: string;
}

export function useAdminAuditLogQuery() {
  return useQuery({
    queryKey: ADMIN_AUDIT_LOG_QUERY_KEY,
    queryFn: () => apiClient.get<AuditLogEntry[]>("/admin/audit-log"),
  });
}
