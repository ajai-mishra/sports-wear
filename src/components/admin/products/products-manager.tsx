"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminCategoriesQuery } from "@/hooks/use-admin-categories";
import { useAdminProductsQuery, useDeleteProductMutation } from "@/hooks/use-admin-products";
import { ApiRequestError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/currency.utils";
import type { Product } from "@/types/product.types";

const ALL_CATEGORIES_FILTER_VALUE = "all";

type StatusFilterValue = "all" | "active" | "inactive";

const STATUS_FILTER_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function priceRangeLabel(product: Product): string {
  if (product.variants.length === 0) return "—";
  const prices = product.variants.map((variant) => variant.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`;
}

export function ProductsManager() {
  const { data: products, isLoading, isError } = useAdminProductsQuery();
  const { data: categories } = useAdminCategoriesQuery();
  const deleteMutation = useDeleteProductMutation();
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES_FILTER_VALUE);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

  const categoryNameById = new Map((categories ?? []).map((category) => [category.id, category.name]));

  const filteredProducts = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    return (products ?? []).filter((product) => {
      const matchesQuery =
        trimmedQuery.length === 0 ||
        product.name.toLowerCase().includes(trimmedQuery) ||
        product.brand.toLowerCase().includes(trimmedQuery);
      const matchesCategory =
        categoryFilter === ALL_CATEGORIES_FILTER_VALUE || product.categoryId === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || product.isActive === (statusFilter === "active");
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const isFiltered =
    searchQuery.trim().length > 0 || categoryFilter !== ALL_CATEGORIES_FILTER_VALUE || statusFilter !== "all";

  async function confirmDelete() {
    if (!deletingProduct) return;
    try {
      await deleteMutation.mutateAsync(deletingProduct.id);
      toast.success("Product deleted.");
      setDeletingProduct(null);
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "Something went wrong.";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage the product catalog and its variants.</p>
        </div>
        <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
          <Plus /> New Product
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load products.</p>}

      {products && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or brand..."
              aria-label="Search products"
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(value) => value && setCategoryFilter(value)}>
            <SelectTrigger className="w-[180px]" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES_FILTER_VALUE}>All categories</SelectItem>
              {(categories ?? []).map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => value && setStatusFilter(value as StatusFilterValue)}
          >
            <SelectTrigger className="w-[160px]" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {products && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No products yet.
                  </TableCell>
                </TableRow>
              )}
              {products.length > 0 && filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {isFiltered ? "No products match your search or filters." : "No products yet."}
                  </TableCell>
                </TableRow>
              )}
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium whitespace-normal">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {categoryNameById.get(product.categoryId) ?? "—"}
                  </TableCell>
                  <TableCell>{priceRangeLabel(product)}</TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "outline"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${product.name}`}
                        render={<Link href={`/admin/products/${product.id}/edit`} />}
                        nativeButton={false}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={deletingProduct !== null} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              This will permanently remove &ldquo;{deletingProduct?.name}&rdquo; and all of its variants. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
