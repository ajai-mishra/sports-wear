"use client";

import { AlertTriangle } from "lucide-react";

import { RatingStars } from "@/components/product/rating-stars";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useAdminReportsSummaryQuery,
  type CategoryRevenueRow,
  type TopProductByReviewsRow,
} from "@/hooks/use-admin-reports";
import { formatCurrency } from "@/lib/currency.utils";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

/**
 * A single-series horizontal bar list — plain divs with percentage widths,
 * no charting library. Bars share one hue (the app's primary token) since a
 * single series needs no legend: the value is direct-labeled at the bar's
 * end and the row label carries identity, so color never has to.
 */
interface BarChartRow {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  extra?: React.ReactNode;
}

function HorizontalBarChart({ rows, emptyMessage }: { rows: BarChartRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const widthPercentage = Math.max((row.value / maxValue) * 100, 2);
        return (
          <li key={row.key} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-sm text-muted-foreground" title={row.label}>
              {row.label}
            </span>
            <div className="h-5 min-w-0 flex-1 rounded-full bg-muted" role="img" aria-label={`${row.label}: ${row.formattedValue}`}>
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${widthPercentage}%` }}
              />
            </div>
            <span className="w-24 shrink-0 text-right text-sm font-medium tabular-nums">{row.formattedValue}</span>
            {row.extra}
          </li>
        );
      })}
    </ul>
  );
}

function toTopProductRows(topProductsByReviews: TopProductByReviewsRow[]): BarChartRow[] {
  return topProductsByReviews.map((product) => ({
    key: product.productName,
    label: product.productName,
    value: product.reviewCount,
    formattedValue: `${product.reviewCount} review${product.reviewCount === 1 ? "" : "s"}`,
    extra: <RatingStars rating={product.rating} className="hidden shrink-0 sm:flex" />,
  }));
}

function toCategoryRevenueRows(revenueByCategory: CategoryRevenueRow[]): BarChartRow[] {
  return revenueByCategory.map((category) => ({
    key: category.categoryName,
    label: category.categoryName,
    value: category.revenue,
    formattedValue: formatCurrency(category.revenue),
  }));
}

export function ReportsDashboard() {
  const { data: summary, isLoading, isError } = useAdminReportsSummaryQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">Store performance at a glance.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading reports...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load reports.</p>}

      {summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Revenue" value={formatCurrency(summary.totalRevenue)} />
            <StatCard label="Total Orders" value={String(summary.totalOrders)} />
            <StatCard label="Total Customers" value={String(summary.totalCustomers)} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-border p-4">
              <h2 className="font-medium">Top Products by Reviews</h2>
              <HorizontalBarChart
                rows={toTopProductRows(summary.topProductsByReviews)}
                emptyMessage="No review data yet."
              />
            </div>

            <div className="space-y-3 rounded-xl border border-border p-4">
              <h2 className="font-medium">Revenue by Category</h2>
              <HorizontalBarChart
                rows={toCategoryRevenueRows(summary.revenueByCategory)}
                emptyMessage="No revenue data yet."
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="font-medium">Low Stock Variants</h2>
              {summary.lowStockVariants.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="size-3.5" />
                  {summary.lowStockVariants.length} at or below reorder threshold
                </span>
              )}
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Reorder at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.lowStockVariants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No variants at or below their reorder threshold.
                      </TableCell>
                    </TableRow>
                  )}
                  {summary.lowStockVariants.map((variant) => (
                    <TableRow key={variant.variantId} className="bg-amber-500/10 hover:bg-amber-500/15">
                      <TableCell className="font-medium">{variant.productName}</TableCell>
                      <TableCell className="text-muted-foreground">{variant.sku}</TableCell>
                      <TableCell>{variant.stockQuantity}</TableCell>
                      <TableCell className="text-muted-foreground">{variant.reorderThreshold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
