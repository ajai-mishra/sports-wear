import { OrderStatus, PaymentStatus, type Order } from "@/types/order.types";
import { PRODUCTS } from "@/mocks/data/products.data";
import { ADDRESSES } from "@/mocks/data/addresses.data";
import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";

const trackSuit = PRODUCTS.find((product) => product.slug === "velocity-full-zip-track-suit")!;
const runningShoe = PRODUCTS.find((product) => product.slug === "stridewear-pulse-running-shoe")!;
const socks = PRODUCTS.find((product) => product.slug === "cushion-run-crew-socks-3pk")!;

const customerAddress = ADDRESSES[0];

export const ORDERS: Order[] = getOrCreateGlobalSingleton("orders", () => [
  {
    id: "order-1001",
    userId: "user-customer-1",
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    items: [
      {
        variantId: trackSuit.variants[0].id,
        productId: trackSuit.id,
        productSlug: trackSuit.slug,
        productName: trackSuit.name,
        imageUrl: trackSuit.images[0].url,
        size: trackSuit.variants[0].size,
        color: trackSuit.variants[0].color,
        unitPrice: trackSuit.variants[0].price,
        quantity: 1,
      },
    ],
    subtotal: trackSuit.variants[0].price,
    discountAmount: 0,
    shippingFee: 0,
    total: trackSuit.variants[0].price,
    couponCode: null,
    shippingAddress: customerAddress,
    statusHistory: [
      { status: OrderStatus.PENDING, occurredAt: "2025-12-01T09:00:00.000Z", note: null },
      { status: OrderStatus.CONFIRMED, occurredAt: "2025-12-01T09:05:00.000Z", note: null },
      { status: OrderStatus.SHIPPED, occurredAt: "2025-12-02T14:00:00.000Z", note: "Shipped via BlueDart" },
      { status: OrderStatus.DELIVERED, occurredAt: "2025-12-05T11:30:00.000Z", note: null },
    ],
    createdAt: "2025-12-01T09:00:00.000Z",
  },
  {
    id: "order-1002",
    userId: "user-customer-1",
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.PAID,
    items: [
      {
        variantId: runningShoe.variants[2].id,
        productId: runningShoe.id,
        productSlug: runningShoe.slug,
        productName: runningShoe.name,
        imageUrl: runningShoe.images[0].url,
        size: runningShoe.variants[2].size,
        color: runningShoe.variants[2].color,
        unitPrice: runningShoe.variants[2].price,
        quantity: 1,
      },
      {
        variantId: socks.variants[0].id,
        productId: socks.id,
        productSlug: socks.slug,
        productName: socks.name,
        imageUrl: socks.images[0].url,
        size: socks.variants[0].size,
        color: socks.variants[0].color,
        unitPrice: socks.variants[0].price,
        quantity: 2,
      },
    ],
    subtotal: runningShoe.variants[2].price + socks.variants[0].price * 2,
    discountAmount: 200,
    shippingFee: 0,
    total: runningShoe.variants[2].price + socks.variants[0].price * 2 - 200,
    couponCode: "WELCOME200",
    shippingAddress: customerAddress,
    statusHistory: [
      { status: OrderStatus.PENDING, occurredAt: "2026-08-10T09:00:00.000Z", note: null },
      { status: OrderStatus.CONFIRMED, occurredAt: "2026-08-10T09:10:00.000Z", note: null },
      { status: OrderStatus.SHIPPED, occurredAt: "2026-08-12T16:00:00.000Z", note: "Shipped via Delhivery" },
    ],
    createdAt: "2026-08-10T09:00:00.000Z",
  },
  {
    id: "order-1003",
    userId: "user-customer-1",
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PAID,
    items: [
      {
        variantId: trackSuit.variants[3].id,
        productId: trackSuit.id,
        productSlug: trackSuit.slug,
        productName: trackSuit.name,
        imageUrl: trackSuit.images[0].url,
        size: trackSuit.variants[3].size,
        color: trackSuit.variants[3].color,
        unitPrice: trackSuit.variants[3].price,
        quantity: 1,
      },
    ],
    subtotal: trackSuit.variants[3].price,
    discountAmount: 0,
    shippingFee: 99,
    total: trackSuit.variants[3].price + 99,
    couponCode: null,
    shippingAddress: customerAddress,
    statusHistory: [
      { status: OrderStatus.PENDING, occurredAt: "2026-08-16T18:00:00.000Z", note: null },
    ],
    createdAt: "2026-08-16T18:00:00.000Z",
  },
]);
