"use client";

import Link from "next/link";
import { MapPin, Package, RotateCcw, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/currency.utils";

interface QuickLink {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const QUICK_LINKS: QuickLink[] = [
  { label: "Orders", description: "Track and manage your orders", href: "/account/orders", icon: Package },
  { label: "Addresses", description: "Manage your delivery addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", description: "Update your personal details", href: "/account/profile", icon: User },
  { label: "Returns", description: "Request a return on a delivered order", href: "/account/returns", icon: RotateCcw },
];

export default function AccountDashboardPage() {
  const { data: user } = useSession();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const mostRecentOrder = orders?.[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">Manage your orders, addresses, and account details.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="group block">
              <Card className="h-full transition-colors group-hover:bg-muted/50">
                <CardHeader>
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <CardTitle>{link.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent Order</h2>
        {isLoadingOrders ? (
          <Skeleton className="h-24 w-full" />
        ) : mostRecentOrder ? (
          <Card>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Order #{mostRecentOrder.id}</p>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(mostRecentOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={mostRecentOrder.status} />
                <span className="font-semibold">{formatCurrency(mostRecentOrder.total)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  render={<Link href={`/account/orders/${mostRecentOrder.id}`} />}
                  nativeButton={false}
                >
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will show up here."
            action={
              <Button render={<Link href="/search" />} nativeButton={false}>
                Start Shopping
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
