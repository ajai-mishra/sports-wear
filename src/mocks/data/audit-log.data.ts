import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";

export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  actorName: string;
  action: string; // e.g. "PRODUCT_CREATED", "STOCK_ADJUSTED", "DISCOUNT_UPDATED"
  entityType: string; // e.g. "Product", "Discount", "Order"
  entityId: string;
  occurredAt: string;
}

export const AUDIT_LOG: AuditLogEntry[] = getOrCreateGlobalSingleton("auditLog", () => []);
