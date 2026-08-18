import { AgeGroup, type ProductListFilters, type ProductSortOption } from "@/types/product.types";

const VALID_SORT_OPTIONS: readonly ProductSortOption[] = [
  "relevance",
  "price-asc",
  "price-desc",
  "newest",
  "best-selling",
  "rating",
];

function parseCommaSeparated(value: string | null): string[] | undefined {
  if (!value) return undefined;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

/**
 * Shared between the /api/products route handler and the server-rendered
 * listing pages (/search, /category/[slug]) so URL query params are
 * interpreted identically whether the catalog is queried over HTTP or via a
 * direct service call.
 */
export function parseProductFilters(searchParams: URLSearchParams): ProductListFilters {
  const sortParam = searchParams.get("sort");
  const sort = VALID_SORT_OPTIONS.includes(sortParam as ProductSortOption)
    ? (sortParam as ProductSortOption)
    : undefined;

  const ageGroupsParam = parseCommaSeparated(searchParams.get("ageGroups"));

  return {
    categorySlug: searchParams.get("category") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    minPrice: searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sizes: parseCommaSeparated(searchParams.get("sizes")),
    colors: parseCommaSeparated(searchParams.get("colors")),
    brands: parseCommaSeparated(searchParams.get("brands")),
    ageGroups: ageGroupsParam?.filter((value): value is AgeGroup =>
      Object.values(AgeGroup).includes(value as AgeGroup),
    ),
    minRating: searchParams.has("minRating") ? Number(searchParams.get("minRating")) : undefined,
    onSaleOnly: searchParams.get("onSaleOnly") === "true",
    sort,
    page: searchParams.has("page") ? Number(searchParams.get("page")) : undefined,
    pageSize: searchParams.has("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
  };
}
