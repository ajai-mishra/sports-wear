import { redirect } from "next/navigation";

import { BannersManager } from "@/components/admin/banners/banners-manager";
import { getServerSession } from "@/lib/auth/get-server-session";
import { sessionHasRole } from "@/lib/auth/route-guards";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.MARKETING_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];

/**
 * Page-level role check — required even though src/proxy.ts and the parent
 * (protected) layout already confirm "is this person staff at all". Neither
 * of those is granular enough: an Inventory Manager or Support Agent is
 * staff and would otherwise reach this page's UI. This is the real gate.
 */
export default async function AdminBannersPage() {
  const session = await getServerSession();
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    redirect("/admin");
  }

  return <BannersManager />;
}
