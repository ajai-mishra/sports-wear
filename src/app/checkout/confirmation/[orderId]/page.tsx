"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, PackageX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/order-status-badge";
import { PageContainer } from "@/components/shared/page-container";
import { useOrder } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/currency.utils";

/**
 * A Client Component calling GET /api/account/orders/[id] through the
 * useOrder hook, rather than a Server Component reading the order straight
 * off the service layer. The mock in-memory ORDERS array is mutated by the
 * POST /api/checkout Route Handler; under Turbopack's dev server, Route
 * Handlers reliably share that module state with each other, but a Server
 * Component's render pipeline does not observe writes made by a Route
 * Handler (a dev-time module-instance split, not a real backend concern
 * once this points at a real API). Going through the same Route Handler
 * world (/api/account/orders/[id]) that /api/checkout wrote to sidesteps it.
 */
export default function CheckoutConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, isError } = useOrder(orderId);

  if (isLoading) {
    return (
      <PageContainer className="py-16">
        <p className="text-center text-sm text-muted-foreground">Loading your order...</p>
      </PageContainer>
    );
  }

  if (isError || !order) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={PackageX}
          title="Order not found"
          description="We couldn't find this order, or it doesn't belong to your account."
          action={
            <Button render={<Link href="/account/orders" />} nativeButton={false}>
              View My Orders
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-semibold">Thank you for your order!</h1>
            <p className="text-muted-foreground">Your order has been placed successfully.</p>
          </div>
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <OrderStatusBadge status={order.status} />
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>

            <Separator />

            <ul className="space-y-3">
              {order.items.map((item) => (
                <li key={item.variantId} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-muted-foreground">
                      {item.size} · {item.color} · Qty {item.quantity}
                    </p>
                  </div>
                  <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <Separator />

            <div className="space-y-1 text-sm">
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
                <span>{order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium">Shipping to</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.fullName}, {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" render={<Link href="/account/orders" />} nativeButton={false}>
          View My Orders
        </Button>
      </div>
    </PageContainer>
  );
}
