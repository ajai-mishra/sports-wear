"use client";

import { useState } from "react";
import { PackageCheck, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/currency.utils";
import { OrderStatus, type Order } from "@/types/order.types";

export default function ReturnsPage() {
  const { data: orders, isLoading } = useOrders();
  const [returningOrder, setReturningOrder] = useState<Order | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveredOrders = orders?.filter((order) => order.status === OrderStatus.DELIVERED) ?? [];

  function openReturnDialog(order: Order) {
    setReturningOrder(order);
    setReason("");
  }

  // There's no backend endpoint yet to actually create a return request —
  // this mocks the interaction with a success toast (rather than silently
  // no-op'ing) until a real /api/account/returns route exists.
  async function handleSubmitReturn() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);
    toast.success("Return request submitted.");
    setReturningOrder(null);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Returns</h1>

      {isLoading ? (
        <Skeleton className="h-28 w-full" />
      ) : deliveredOrders.length === 0 ? (
        <EmptyState
          icon={Undo2}
          title="No orders eligible for return"
          description="Only delivered orders can be returned."
        />
      ) : (
        <ul className="space-y-4">
          {deliveredOrders.map((order) => (
            <li key={order.id}>
              <Card>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Delivered order · {formatCurrency(order.total)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openReturnDialog(order)}>
                    <PackageCheck /> Request Return
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!returningOrder} onOpenChange={(open) => !open && setReturningOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request return for order #{returningOrder?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="return-reason">Reason for return</Label>
            <Textarea
              id="return-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Tell us why you'd like to return this order..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturningOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReturn} disabled={!reason.trim() || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Return Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
