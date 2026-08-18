"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/currency.utils";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
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
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/account/orders/${order.id}`} className="block">
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.variantId}
                            className="relative size-14 overflow-hidden rounded-md border border-border bg-muted"
                          >
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                          {order.items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <OrderStatusBadge status={order.status} />
                      <span className="font-semibold">{formatCurrency(order.total)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
