import { redirect } from "next/navigation";

import { ProductForm } from "@/components/admin/products/product-form";
import { getServerSession } from "@/lib/auth/get-server-session";
import { sessionHasRole } from "@/lib/auth/route-guards";
import { UserRole } from "@/types/auth.types";

const ALLOWED_ROLES = [UserRole.INVENTORY_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];

/**
 * Page-level role check — required even though src/proxy.ts and the parent
 * (protected) layout already confirm "is this person staff at all". Neither
 * of those is granular enough: a Support Agent or Marketing Manager is
 * staff and would otherwise reach this page's UI. This is the real gate.
 */
export default async function NewProductPage() {
  const session = await getServerSession();
  if (!sessionHasRole(session, ALLOWED_ROLES)) {
    redirect("/admin");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">New product</h1>
        <p className="text-sm text-muted-foreground">Add a new product to the catalog.</p>
      </div>
      <ProductForm />
    </div>
  );
}
