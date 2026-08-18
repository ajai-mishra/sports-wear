import Link from "next/link";
import { redirect } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getServerSession } from "@/lib/auth/get-server-session";
import { formatCurrency } from "@/lib/currency.utils";
import { cn } from "@/lib/utils";
import { listCustomers } from "@/services/auth.service";
import { listAllBanners } from "@/services/banner.service";
import { listAllDiscounts } from "@/services/discount.service";
import { listAllOrders } from "@/services/order.service";
import { listAllProductsForAdmin } from "@/services/product.service";
import { UserRole } from "@/types/auth.types";
import { PaymentStatus } from "@/types/order.types";

function StatCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const className = cn(
    "rounded-xl border border-border bg-card p-4 transition-colors",
    href && "hover:bg-muted/50",
  );

  if (!href) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </Link>
  );
}

function AdminOverview() {
  const orders = listAllOrders();
  const products = listAllProductsForAdmin();

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = listCustomers().length;
  const lowStockCount = products.reduce(
    (count, product) =>
      count + product.variants.filter((variant) => variant.stockQuantity <= variant.reorderThreshold).length,
    0,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} />
      <StatCard label="Total Orders" value={String(totalOrders)} />
      <StatCard label="Total Customers" value={String(totalCustomers)} />
      <StatCard label="Low Stock Variants" value={String(lowStockCount)} href="/admin/inventory" />
    </div>
  );
}

function InventoryOverview() {
  const products = listAllProductsForAdmin();
  const variants = products.flatMap((product) => product.variants);
  const lowStockCount = variants.filter((variant) => variant.stockQuantity <= variant.reorderThreshold).length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Products" value={String(products.length)} href="/admin/products" />
      <StatCard label="Total Variants" value={String(variants.length)} href="/admin/inventory" />
      <StatCard label="At/Below Reorder Threshold" value={String(lowStockCount)} href="/admin/inventory" />
    </div>
  );
}

function MarketingOverview() {
  const discounts = listAllDiscounts();
  const banners = listAllBanners();
  const activeDiscountCount = discounts.filter((discount) => discount.isActive).length;
  const activeBannerCount = banners.filter((banner) => banner.isActive).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        label="Active Discounts"
        value={`${activeDiscountCount} / ${discounts.length}`}
        href="/admin/discounts"
      />
      <StatCard label="Active Banners" value={`${activeBannerCount} / ${banners.length}`} href="/admin/banners" />
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {session.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">{session.role.replaceAll("_", " ")}</p>
      </div>

      {(session.role === UserRole.ADMIN || session.role === UserRole.SUPER_ADMIN) && <AdminOverview />}
      {session.role === UserRole.INVENTORY_MANAGER && <InventoryOverview />}
      {session.role === UserRole.MARKETING_MANAGER && <MarketingOverview />}
      {session.role === UserRole.SUPPORT_AGENT && (
        <Alert>
          <AlertTitle>No catalog modules assigned</AlertTitle>
          <AlertDescription>
            Your role doesn&apos;t have access to catalog, inventory, or marketing tools yet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
