"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { Order } from "@/types/order.types";

export const ACCOUNT_ORDERS_QUERY_KEY = ["account", "orders"] as const;

export function useOrders() {
  return useQuery({
    queryKey: ACCOUNT_ORDERS_QUERY_KEY,
    queryFn: () => apiClient.get<Order[]>("/account/orders"),
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: [...ACCOUNT_ORDERS_QUERY_KEY, orderId],
    queryFn: () => apiClient.get<Order>(`/account/orders/${orderId}`),
    enabled: Boolean(orderId),
    // A 404 here means "not found or not owned" — retrying won't help, and we
    // want the page to show the friendly not-found state quickly.
    retry: false,
  });
}
