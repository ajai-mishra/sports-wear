import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@/types/order.types";

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-muted text-muted-foreground border-transparent",
  [OrderStatus.CONFIRMED]: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-transparent",
  [OrderStatus.SHIPPED]: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-transparent",
  [OrderStatus.DELIVERED]: "bg-success/10 text-success border-transparent",
  [OrderStatus.CANCELLED]: "bg-destructive/10 text-destructive border-transparent",
  [OrderStatus.REFUNDED]: "bg-muted text-muted-foreground border-transparent",
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.CONFIRMED]: "Confirmed",
  [OrderStatus.SHIPPED]: "Shipped",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.REFUNDED]: "Refunded",
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return <Badge className={cn(ORDER_STATUS_STYLES[status], className)}>{ORDER_STATUS_LABELS[status]}</Badge>;
}

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "bg-muted text-muted-foreground border-transparent",
  [PaymentStatus.PAID]: "bg-success/10 text-success border-transparent",
  [PaymentStatus.FAILED]: "bg-destructive/10 text-destructive border-transparent",
  [PaymentStatus.REFUNDED]: "bg-muted text-muted-foreground border-transparent",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Payment Pending",
  [PaymentStatus.PAID]: "Paid",
  [PaymentStatus.FAILED]: "Payment Failed",
  [PaymentStatus.REFUNDED]: "Refunded",
};

export function PaymentStatusBadge({ status, className }: { status: PaymentStatus; className?: string }) {
  return <Badge className={cn(PAYMENT_STATUS_STYLES[status], className)}>{PAYMENT_STATUS_LABELS[status]}</Badge>;
}
