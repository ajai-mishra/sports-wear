import { redirect } from "next/navigation";

import { ReportsDashboard } from "@/components/admin/reports/reports-dashboard";
import { getServerSession } from "@/lib/auth/get-server-session";
import { sessionHasRole } from "@/lib/auth/route-guards";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

/**
 * Page-level role check — required even though src/proxy.ts and the parent
 * (protected) layout already confirm "is this person staff at all". Reports
 * are Admin/Super Admin-only; every other staff role must be blocked here
 * even though they all pass the coarser checks upstream.
 */
export default async function AdminReportsPage() {
  const session = await getServerSession();
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    redirect("/admin");
  }

  return <ReportsDashboard />;
}
