"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/order-status-badge";
import { OrderTimeline } from "@/components/account/order-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/currency.utils";

export default function OrderDetailPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = use(props.params);
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <EmptyState
        icon={PackageX}
        title="Order not found"
        description="We couldn't find this order, or it doesn't belong to your account."
        action={
          <Button render={<Link href="/account/orders" />} nativeButton={false}>
            Back to Orders
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image src={item.imageUrl} alt={item.productName} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {item.size} · {item.color} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="self-center text-sm font-medium">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline events={order.statusHistory} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shippingFee > 0 ? formatCurrency(order.shippingFee) : "Free"}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
