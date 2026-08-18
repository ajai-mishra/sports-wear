import { ProductCard } from "@/components/product/product-card";
import type { ProductSummary } from "@/types/product.types";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
