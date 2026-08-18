"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/currency.utils";
import { cn } from "@/lib/utils";
import { AgeGroup, type ProductFacets } from "@/types/product.types";

const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  [AgeGroup.KIDS]: "Kids",
  [AgeGroup.TEEN]: "Teen",
  [AgeGroup.ADULT]: "Adult",
};

function parseCommaParam(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

interface ProductFiltersProps {
  facets: ProductFacets;
  className?: string;
  /**
   * This component renders twice on listing pages — once in the desktop
   * sidebar, once inside the mobile filter Sheet — so every id must be
   * prefixed to stay unique; duplicate ids are invalid HTML and break
   * label-for association plus id-based test/automation queries.
   */
  idPrefix: string;
}

export function ProductFilters({ facets, className, idPrefix }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const toggleListParam = (key: string, value: string) => {
    const current = parseCommaParam(searchParams.get(key));
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateParams({ [key]: next.length > 0 ? next.join(",") : null });
  };

  const selectedSizes = parseCommaParam(searchParams.get("sizes"));
  const selectedColors = parseCommaParam(searchParams.get("colors"));
  const selectedAgeGroups = parseCommaParam(searchParams.get("ageGroups"));
  const onSaleOnly = searchParams.get("onSaleOnly") === "true";
  const minPrice = Number(searchParams.get("minPrice") ?? facets.priceRange.min);
  const maxPrice = Number(searchParams.get("maxPrice") ?? facets.priceRange.max);

  const activeFilterCount =
    selectedSizes.length +
    selectedColors.length +
    selectedAgeGroups.length +
    (onSaleOnly ? 1 : 0) +
    (searchParams.has("minPrice") || searchParams.has("maxPrice") ? 1 : 0);

  function clearAllFilters() {
    router.push(pathname);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-auto p-0 text-xs">
            <X className="size-3" /> Clear all
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`${idPrefix}-on-sale-only`}
          checked={onSaleOnly}
          onCheckedChange={(checked) => updateParams({ onSaleOnly: checked ? "true" : null })}
        />
        <Label htmlFor={`${idPrefix}-on-sale-only`} className="text-sm font-normal">
          On sale only
        </Label>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Price</h3>
        <Slider
          min={facets.priceRange.min}
          max={facets.priceRange.max}
          step={50}
          value={[minPrice, maxPrice]}
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              updateParams({ minPrice: String(value[0]), maxPrice: String(value[1]) });
            }
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(minPrice)}</span>
          <span>{formatCurrency(maxPrice)}</span>
        </div>
      </div>

      {facets.sizes.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Size</h3>
            <div className="flex flex-wrap gap-1.5">
              {facets.sizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleListParam("sizes", size)}
                    aria-pressed={isSelected}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-muted",
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {facets.colors.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Color</h3>
            <div className="flex flex-wrap gap-2">
              {facets.colors.map((color) => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleListParam("colors", color.name)}
                    aria-pressed={isSelected}
                    aria-label={color.name}
                    title={color.name}
                    className={cn(
                      "size-6 rounded-full border-2 transition-all",
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-border",
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}

      {facets.ageGroups.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Age Group</h3>
            {facets.ageGroups.map((ageGroup) => (
              <div key={ageGroup} className="flex items-center gap-2">
                <Checkbox
                  id={`${idPrefix}-age-${ageGroup}`}
                  checked={selectedAgeGroups.includes(ageGroup)}
                  onCheckedChange={() => toggleListParam("ageGroups", ageGroup)}
                />
                <Label htmlFor={`${idPrefix}-age-${ageGroup}`} className="text-sm font-normal">
                  {AGE_GROUP_LABELS[ageGroup]}
                </Label>
              </div>
            ))}
          </div>
        </>
      )}

      {activeFilterCount > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-1.5">
            {selectedSizes.map((size) => (
              <Badge
                key={size}
                variant="secondary"
                render={<button type="button" aria-label={`Remove ${size} filter`} />}
                onClick={() => toggleListParam("sizes", size)}
              >
                {size} <X className="size-3" />
              </Badge>
            ))}
            {selectedColors.map((color) => (
              <Badge
                key={color}
                variant="secondary"
                render={<button type="button" aria-label={`Remove ${color} filter`} />}
                onClick={() => toggleListParam("colors", color)}
              >
                {color} <X className="size-3" />
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
