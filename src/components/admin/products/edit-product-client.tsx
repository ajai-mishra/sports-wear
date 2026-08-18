"use client";

import { useAdminProductsQuery } from "@/hooks/use-admin-products";

import { ProductForm } from "./product-form";

export function EditProductClient({ productId }: { productId: string }) {
  const { data: products, isLoading, isError } = useAdminProductsQuery();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading product...</p>;
  }
  if (isError) {
    return <p className="text-sm text-destructive">Failed to load product.</p>;
  }

  const product = products?.find((candidate) => candidate.id === productId);
  if (!product) {
    return <p className="text-sm text-destructive">No product found with that id.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Edit product</h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
