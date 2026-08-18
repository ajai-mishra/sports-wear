"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { PriceDisplay } from "@/components/product/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import { WishlistToggleButton } from "@/components/product/wishlist-toggle-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";
import type { Product } from "@/types/product.types";

export function ProductInfoPanel({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const setCartDrawerOpen = useUiStore((state) => state.setCartDrawerOpen);

  const activeVariants = useMemo(() => product.variants.filter((variant) => variant.isActive), [product.variants]);

  const colors = useMemo(() => {
    const colorMap = new Map<string, string>();
    for (const variant of activeVariants) colorMap.set(variant.color, variant.colorHex);
    return [...colorMap.entries()].map(([name, hex]) => ({ name, hex }));
  }, [activeVariants]);

  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0]?.name ?? null);

  const sizesForSelectedColor = useMemo(
    () => activeVariants.filter((variant) => variant.color === selectedColor).map((variant) => variant.size),
    [activeVariants, selectedColor],
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(sizesForSelectedColor[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(
    () => activeVariants.find((variant) => variant.color === selectedColor && variant.size === selectedSize) ?? null,
    [activeVariants, selectedColor, selectedSize],
  );

  function handleColorChange(color: string) {
    setSelectedColor(color);
    const nextSizes = activeVariants.filter((variant) => variant.color === color).map((variant) => variant.size);
    setSelectedSize(nextSizes[0] ?? null);
    setQuantity(1);
  }

  function handleSizeChange(size: string) {
    setSelectedSize(size);
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      brand: product.brand,
      imageUrl: product.images[0]?.url ?? "",
      size: selectedVariant.size,
      color: selectedVariant.color,
      unitPrice: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice,
      quantity,
      stockQuantity: selectedVariant.stockQuantity,
    });
    toast.success(`${product.name} added to cart.`);
    setCartDrawerOpen(true);
  }

  const isOutOfStock = selectedVariant?.stockQuantity === 0;
  const isLowStock = !!selectedVariant && selectedVariant.stockQuantity > 0 && selectedVariant.stockQuantity <= 5;
  const displayPrice = selectedVariant?.price ?? Math.min(...activeVariants.map((variant) => variant.price));

  return (
    <section aria-label="Product information" className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase">{product.brand}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" className="mt-2" />
      </div>

      <PriceDisplay price={displayPrice} compareAtPrice={selectedVariant?.compareAtPrice ?? null} size="lg" />

      <p className="text-sm text-muted-foreground">{product.shortDescription}</p>

      {colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Color{selectedColor ? `: ${selectedColor}` : ""}</span>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorChange(color.name)}
                aria-label={color.name}
                aria-pressed={selectedColor === color.name}
                title={color.name}
                className={cn(
                  "size-8 rounded-full border-2 transition-all",
                  selectedColor === color.name ? "border-primary ring-2 ring-primary/30" : "border-border",
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {sizesForSelectedColor.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Size{selectedSize ? `: ${selectedSize}` : ""}</span>
          <div className="flex flex-wrap gap-2">
            {sizesForSelectedColor.map((size) => {
              const variant = activeVariants.find((v) => v.color === selectedColor && v.size === size);
              const outOfStock = !variant || variant.stockQuantity === 0;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => handleSizeChange(size)}
                  aria-pressed={selectedSize === size}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input hover:bg-muted",
                    outOfStock && "cursor-not-allowed opacity-40 line-through",
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedVariant && (
        <p
          className={cn(
            "text-sm font-medium",
            isOutOfStock ? "text-destructive" : isLowStock ? "text-primary" : "text-success",
          )}
        >
          {isOutOfStock ? "Out of stock" : isLowStock ? `Only ${selectedVariant.stockQuantity} left in stock` : "In stock"}
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-md border border-input">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => current - 1)}
          >
            <Minus />
          </Button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Increase quantity"
            disabled={!selectedVariant || quantity >= selectedVariant.stockQuantity}
            onClick={() => setQuantity((current) => current + 1)}
          >
            <Plus />
          </Button>
        </div>

        <Button type="button" className="flex-1" disabled={!selectedVariant || isOutOfStock} onClick={handleAddToCart}>
          <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        <WishlistToggleButton
          item={{
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            brand: product.brand,
            imageUrl: product.images[0]?.url ?? "",
            price: selectedVariant?.price ?? activeVariants[0]?.price ?? 0,
            compareAtPrice: selectedVariant?.compareAtPrice ?? null,
            addedAt: new Date().toISOString(),
          }}
        />
      </div>
    </section>
  );
}
