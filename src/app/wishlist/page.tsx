"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { PriceDisplay } from "@/components/product/price-display";
import { useWishlistStore } from "@/store/wishlist.store";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart icon on any product to save it here for later."
          action={
            <Button render={<Link href="/search" />} nativeButton={false}>
              Continue shopping
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 sm:py-12">
      <h1 className="mb-6 text-2xl font-semibold">Your Wishlist ({items.length})</h1>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.productId}>
            <Card className="h-full overflow-hidden py-0">
              <Link href={`/products/${item.productSlug}`} className="block">
                <div className="relative aspect-square w-full bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Link>
              <CardContent className="flex flex-1 flex-col gap-1 px-3 pb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase">{item.brand}</p>
                <Link
                  href={`/products/${item.productSlug}`}
                  className="line-clamp-2 text-sm font-medium hover:underline"
                >
                  {item.productName}
                </Link>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <PriceDisplay price={item.price} compareAtPrice={item.compareAtPrice} size="sm" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${item.productName} from wishlist`}
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
