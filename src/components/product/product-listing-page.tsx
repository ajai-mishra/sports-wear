import { SearchX } from "lucide-react";

import { MobileFilterSheet } from "@/components/product/mobile-filter-sheet";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPagination } from "@/components/product/product-pagination";
import { ProductSortSelect } from "@/components/product/product-sort-select";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { parseProductFilters } from "@/lib/parse-product-filters";
import { getProductFacets, listProducts } from "@/services/product.service";

interface ProductListingPageProps {
  title: string;
  description?: string;
  categorySlug?: string;
  searchParamsRecord: Record<string, string | undefined>;
  basePath: string;
}

export function ProductListingPage({
  title,
  description,
  categorySlug,
  searchParamsRecord,
  basePath,
}: ProductListingPageProps) {
  const urlSearchParams = new URLSearchParams(
    Object.entries(searchParamsRecord).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );

  const filters = parseProductFilters(urlSearchParams);
  if (categorySlug) filters.categorySlug = categorySlug;

  const result = listProducts(filters);
  const facets = getProductFacets(categorySlug);

  return (
    <PageContainer className="flex flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters facets={facets} idPrefix="desktop-filters" />
        </aside>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MobileFilterSheet facets={facets} />
              <p className="text-sm text-muted-foreground">
                {result.total} {result.total === 1 ? "product" : "products"}
              </p>
            </div>
            <ProductSortSelect />
          </div>

          {result.data.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No products found"
              description="Try adjusting or clearing your filters to see more results."
            />
          ) : (
            <>
              <ProductGrid products={result.data} />
              <ProductPagination
                currentPage={result.page}
                totalPages={result.totalPages}
                basePath={basePath}
                searchParams={searchParamsRecord}
              />
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
