import { ORDERS } from "@/mocks/data/orders.data";
import { OrderStatus, PaymentStatus, type Order, type OrderLineItem } from "@/types/order.types";
import type { Address } from "@/types/address.types";

export function listOrdersForUser(userId: string): Order[] {
  return ORDERS.filter((order) => order.userId === userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * Ownership check lives here, not just in the route handler, so the same
 * guarantee ("a user can only ever read their own order") survives the
 * eventual swap to a real NestJS OrderService backed by a database.
 */
export function getOrderForUser(orderId: string, userId: string): Order | null {
  return ORDERS.find((order) => order.id === orderId && order.userId === userId) ?? null;
}

export function listAllOrders(): Order[] {
  return ORDERS;
}

export interface CreateOrderInput {
  userId: string;
  items: OrderLineItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  couponCode: string | null;
  shippingAddress: Address;
}

export function createOrder(input: CreateOrderInput): Order {
  const order: Order = {
    id: `order-${Date.now()}`,
    userId: input.userId,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PAID,
    items: input.items,
    subtotal: input.subtotal,
    discountAmount: input.discountAmount,
    shippingFee: input.shippingFee,
    total: input.subtotal - input.discountAmount + input.shippingFee,
    couponCode: input.couponCode,
    shippingAddress: input.shippingAddress,
    statusHistory: [{ status: OrderStatus.PENDING, occurredAt: new Date().toISOString(), note: null }],
    createdAt: new Date().toISOString(),
  };
  ORDERS.push(order);
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
  const order = ORDERS.find((candidate) => candidate.id === orderId);
  if (!order) return null;
  order.status = status;
  order.statusHistory.push({ status, occurredAt: new Date().toISOString(), note: note ?? null });
  return order;
}
