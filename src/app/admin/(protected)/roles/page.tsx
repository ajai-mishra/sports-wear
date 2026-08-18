import { redirect } from "next/navigation";

import { RolesManager } from "@/components/admin/roles/roles-manager";
import { getServerSession } from "@/lib/auth/get-server-session";
import { sessionHasRole } from "@/lib/auth/route-guards";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.SUPER_ADMIN];

/**
 * Page-level role check — required even though src/proxy.ts and the parent
 * (protected) layout already confirm "is this person staff at all". Staff
 * management is Super Admin-only; every other staff role must be blocked
 * here even though they all pass the coarser checks upstream.
 */
export default async function AdminRolesPage() {
  const session = await getServerSession();
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    redirect("/admin");
  }

  return <RolesManager />;
}
