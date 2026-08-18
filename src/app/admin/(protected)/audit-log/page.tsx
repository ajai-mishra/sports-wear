import { redirect } from "next/navigation";

import { AuditLogTable } from "@/components/admin/audit-log/audit-log-table";
import { getServerSession } from "@/lib/auth/get-server-session";
import { sessionHasRole } from "@/lib/auth/route-guards";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

/**
 * Page-level role check — required even though src/proxy.ts and the parent
 * (protected) layout already confirm "is this person staff at all". Neither
 * of those is granular enough: a Support Agent or Inventory Manager is staff
 * and would otherwise reach this page's UI. This is the real gate.
 */
export default async function AdminAuditLogPage() {
  const session = await getServerSession();
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    redirect("/admin");
  }

  return <AuditLogTable />;
}
