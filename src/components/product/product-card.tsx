import Image from "next/image";
import Link from "next/link";

import { DiscountBadge } from "@/components/product/discount-badge";
import { PriceDisplay } from "@/components/product/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import { WishlistToggleButton } from "@/components/product/wishlist-toggle-button";
import { Badge } from "@/components/ui/badge";
import type { ProductSummary } from "@/types/product.types";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.discountPercentage !== null && <DiscountBadge percentage={product.discountPercentage} />}
          {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
        </div>
        <WishlistToggleButton
          className="absolute top-2 right-2"
          item={{
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            brand: product.brand,
            imageUrl: product.imageUrl,
            price: product.minPrice,
            compareAtPrice: product.maxCompareAtPrice,
            addedAt: new Date().toISOString(),
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs font-medium text-muted-foreground uppercase">{product.brand}</span>
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.name}</h3>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} className="mt-0.5" />
        <PriceDisplay
          price={product.minPrice}
          compareAtPrice={product.maxCompareAtPrice}
          size="sm"
          className="mt-1"
        />
      </div>
    </Link>
  );
}
