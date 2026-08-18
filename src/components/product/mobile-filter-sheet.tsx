"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { ProductFilters } from "@/components/product/product-filters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { ProductFacets } from "@/types/product.types";

export function MobileFilterSheet({ facets }: { facets: ProductFacets }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden" />}>
        <SlidersHorizontal className="size-4" /> Filters
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <ProductFilters facets={facets} idPrefix="mobile-filters" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
