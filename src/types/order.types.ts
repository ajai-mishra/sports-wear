import type { Address } from "@/types/address.types";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum ReturnRequestStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export interface OrderStatusEvent {
  status: OrderStatus;
  occurredAt: string;
  note: string | null;
}

export interface OrderLineItem {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderLineItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  couponCode: string | null;
  shippingAddress: Address;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  reason: string;
  status: ReturnRequestStatus;
  createdAt: string;
}
