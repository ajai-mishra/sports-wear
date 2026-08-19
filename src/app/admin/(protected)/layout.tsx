import { redirect } from "next/navigation";

import { AdminAccountMenu } from "@/components/admin/admin-account-menu";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { PageContainer } from "@/components/shared/page-container";
import { getServerSession } from "@/lib/auth/get-server-session";
import { sessionHasRole } from "@/lib/auth/route-guards";
import { STAFF_ROLES } from "@/types/auth.types";

/**
 * Shell for every authenticated admin page (everything under /admin except
 * /admin/login, which lives in a sibling segment specifically so it never
 * gets wrapped by this guard — otherwise an unauthenticated visit to the
 * login page itself would redirect... back to the login page).
 *
 * src/proxy.ts already redirects non-staff visitors away from /admin/* before
 * they ever reach this component, but that is a coarse "is this person staff
 * at all" check. This re-check is cheap insurance so the layout never renders
 * for a signed-out or non-staff request even if the proxy is ever bypassed,
 * changed, or misconfigured. It is NOT a substitute for the per-page role
 * checks required on Products/Inventory/Categories/Discounts/Banners — a
 * Support Agent passes this exact check (they ARE staff) but must still be
 * blocked by each individual page.
 */
export default async function AdminProtectedLayout({ children }: LayoutProps<"/admin">) {
  const session = await getServerSession();
  if (!session || !sessionHasRole(session, STAFF_ROLES)) {
    redirect("/admin/login");
  }

  return (
    <PageContainer className="flex flex-1 gap-6 py-6">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-6 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold">Admin Panel</p>
            <p className="text-xs text-muted-foreground">{session.role.replaceAll("_", " ")}</p>
          </div>
          <AdminAccountMenu name={session.name} />
          <AdminSidebarNav role={session.role} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <AdminMobileNav role={session.role} />
          <AdminAccountMenu name={session.name} className="w-auto" />
        </div>
        {children}
      </div>
    </PageContainer>
  );
}
