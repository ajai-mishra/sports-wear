"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { OrderTimeline } from "@/components/account/order-timeline";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/order-status-badge";
import { useAdminOrdersQuery, useUpdateOrderStatusMutation } from "@/hooks/use-admin-orders";
import { ApiRequestError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/currency.utils";
import { OrderStatus, type Order } from "@/types/order.types";

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: OrderStatus.PENDING, label: "Pending" },
  { value: OrderStatus.CONFIRMED, label: "Confirmed" },
  { value: OrderStatus.SHIPPED, label: "Shipped" },
  { value: OrderStatus.DELIVERED, label: "Delivered" },
  { value: OrderStatus.CANCELLED, label: "Cancelled" },
  { value: OrderStatus.REFUNDED, label: "Refunded" },
];

/**
 * Keyed by `order.id` from the parent (see OrderDetailDialog below) so that
 * switching to a different order remounts this form with fresh initial
 * state — no effect-driven reset needed, which avoids the "setState inside
 * an effect" cascading-render footgun for state that's really just derived
 * from which order is selected.
 */
function UpdateOrderStatusSection({ order, onSaved }: { order: Order; onSaved: () => void }) {
  const updateStatusMutation = useUpdateOrderStatusMutation();
  const [nextStatus, setNextStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSaveStatus() {
    setFormError(null);
    try {
      await updateStatusMutation.mutateAsync({
        id: order.id,
        input: { status: nextStatus, note: note.trim() ? note.trim() : undefined },
      });
      toast.success(`Order ${order.id} updated to ${nextStatus}.`);
      onSaved();
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      setFormError(message);
    }
  }

  return (
    <section className="space-y-3 rounded-lg border border-border p-3">
      <h3 className="text-sm font-medium">Update status</h3>
      {formError && (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="order-next-status">New status</Label>
        <Select value={nextStatus} onValueChange={(value) => value && setNextStatus(value)}>
          <SelectTrigger id="order-next-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="order-status-note">Note (optional)</Label>
        <Textarea
          id="order-status-note"
          rows={2}
          placeholder="e.g. Shipped via BlueDart, tracking #..."
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={handleSaveStatus} disabled={updateStatusMutation.isPending || nextStatus === order.status}>
          {updateStatusMutation.isPending ? <Loader2 className="animate-spin" /> : null}
          Save status
        </Button>
      </div>
    </section>
  );
}

interface OrderDetailDialogProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

function OrderDetailDialog({ order, onOpenChange }: OrderDetailDialogProps) {
  return (
    <Dialog open={order !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order #{order?.id}</DialogTitle>
          <DialogDescription>
            {order ? `Placed on ${new Date(order.createdAt).toLocaleDateString()}` : null}
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-medium">Items</h3>
              <div className="space-y-2 rounded-lg border border-border p-3">
                {order.items.map((item) => (
                  <div key={item.variantId} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} · {item.color} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
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
                  <span>{order.shippingFee > 0 ? formatCurrency(order.shippingFee) : "Free"}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-medium">Customer & Shipping</h3>
              <div className="rounded-lg border border-border p-3 text-sm">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-medium">Status History</h3>
              <OrderTimeline events={order.statusHistory} />
            </section>

            <UpdateOrderStatusSection key={order.id} order={order} onSaved={() => onOpenChange(false)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function OrdersManager() {
  const { data: orders, isLoading, isError } = useAdminOrdersQuery();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">Review orders and update their fulfillment status.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load orders.</p>}

      {orders && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <p>{order.shippingAddress.fullName}</p>
                    <p className="text-xs text-muted-foreground">{order.shippingAddress.phone}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <OrderDetailDialog order={selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)} />
    </div>
  );
}
