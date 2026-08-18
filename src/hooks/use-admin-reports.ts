"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

export const ADMIN_REPORTS_SUMMARY_QUERY_KEY = ["admin", "reports", "summary"] as const;

export interface LowStockVariantRow {
  productName: string;
  variantId: string;
  sku: string;
  stockQuantity: number;
  reorderThreshold: number;
}

export interface TopProductByReviewsRow {
  productName: string;
  reviewCount: number;
  rating: number;
}

export interface CategoryRevenueRow {
  categoryName: string;
  revenue: number;
}

/** Shape returned by GET /api/admin/reports/summary. */
export interface AdminReportsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockVariants: LowStockVariantRow[];
  topProductsByReviews: TopProductByReviewsRow[];
  revenueByCategory: CategoryRevenueRow[];
}

export function useAdminReportsSummaryQuery() {
  return useQuery({
    queryKey: ADMIN_REPORTS_SUMMARY_QUERY_KEY,
    queryFn: () => apiClient.get<AdminReportsSummary>("/admin/reports/summary"),
  });
}
