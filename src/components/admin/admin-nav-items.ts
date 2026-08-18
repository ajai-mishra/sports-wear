import { STAFF_ROLES, UserRole } from "@/types/auth.types";

const CATALOG_ROLES: readonly UserRole[] = [
  UserRole.INVENTORY_MANAGER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

const MARKETING_ROLES: readonly UserRole[] = [
  UserRole.MARKETING_MANAGER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

const OPERATIONS_ROLES: readonly UserRole[] = [
  UserRole.SUPPORT_AGENT,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

const REPORTING_ROLES: readonly UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

const STAFF_MANAGEMENT_ROLES: readonly UserRole[] = [UserRole.SUPER_ADMIN];

export interface AdminNavItem {
  label: string;
  href: string;
  /** Roles allowed to see this item AND (independently, at the page level) use it. */
  roles: readonly UserRole[];
}

/**
 * Single source of truth for the admin sidebar. Add a new section by pushing
 * one more `{ label, href, roles }` entry here — nothing else about the
 * sidebar (desktop or mobile) needs to change. Every page this points at is
 * still expected to re-check `sessionHasRole` itself; this array only
 * controls what's *shown*, never what's *allowed*.
 */
export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", roles: STAFF_ROLES },
  { label: "Products", href: "/admin/products", roles: CATALOG_ROLES },
  { label: "Inventory", href: "/admin/inventory", roles: CATALOG_ROLES },
  { label: "Categories", href: "/admin/categories", roles: CATALOG_ROLES },
  { label: "Discounts", href: "/admin/discounts", roles: MARKETING_ROLES },
  { label: "Banners", href: "/admin/banners", roles: MARKETING_ROLES },
  { label: "Orders", href: "/admin/orders", roles: OPERATIONS_ROLES },
  { label: "Customers", href: "/admin/customers", roles: OPERATIONS_ROLES },
  { label: "Reviews", href: "/admin/reviews", roles: OPERATIONS_ROLES },
  { label: "Reports", href: "/admin/reports", roles: REPORTING_ROLES },
  { label: "Roles", href: "/admin/roles", roles: STAFF_MANAGEMENT_ROLES },
  { label: "Audit Log", href: "/admin/audit-log", roles: REPORTING_ROLES },
];
