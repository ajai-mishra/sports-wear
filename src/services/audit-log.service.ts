import { AUDIT_LOG, type AuditLogEntry } from "@/mocks/data/audit-log.data";

export function recordAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "occurredAt">): AuditLogEntry {
  const logEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    occurredAt: new Date().toISOString(),
  };
  AUDIT_LOG.push(logEntry);
  return logEntry;
}

export function listAuditLog(): AuditLogEntry[] {
  return [...AUDIT_LOG].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}
