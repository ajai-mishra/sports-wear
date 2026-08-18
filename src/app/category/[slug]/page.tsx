import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductListingPage } from "@/components/product/product-listing-page";
import { getCategoryBySlug } from "@/services/category.service";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const resolvedSearchParams = toSearchParamsRecord(await searchParams);

  return (
    <ProductListingPage
      title={category.name}
      description={category.description}
      categorySlug={category.slug}
      searchParamsRecord={resolvedSearchParams}
      basePath={`/category/${category.slug}`}
    />
  );
}
