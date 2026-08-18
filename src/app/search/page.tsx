import type { Metadata } from "next";

import { ProductListingPage } from "@/components/product/product-listing-page";

export const metadata: Metadata = {
  title: "Search",
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toSearchParamsRecord(
  raw: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  const record: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    record[key] = Array.isArray(value) ? value[0] : value;
  }
  return record;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = toSearchParamsRecord(await searchParams);
  const query = resolvedSearchParams.q;

  return (
    <ProductListingPage
      title={query ? `Search results for "${query}"` : "All Products"}
      description={query ? undefined : "Browse our full range of track suits, sportswear, and equipment."}
      searchParamsRecord={resolvedSearchParams}
      basePath="/search"
    />
  );
}
