import { PRODUCTS } from "@/mocks/data/products.data";
import { getCategoryBySlug } from "@/services/category.service";
import { calculateDiscountPercentage } from "@/lib/currency.utils";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import {
  type PaginatedResult,
  type Product,
  type ProductFacets,
  type ProductListFilters,
  type ProductSummary,
  type ProductVariant,
} from "@/types/product.types";

function toProductSummary(product: Product): ProductSummary {
  const activeVariants = product.variants.filter((variant) => variant.isActive);
  const prices = activeVariants.map((variant) => variant.price);
  const compareAtPrices = activeVariants
    .map((variant) => variant.compareAtPrice)
    .filter((price): price is number => price !== null);

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxCompareAtPrice = compareAtPrices.length > 0 ? Math.max(...compareAtPrices) : null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    categoryId: product.categoryId,
    imageUrl: product.images[0]?.url ?? "",
    imageAlt: product.images[0]?.alt ?? product.name,
    minPrice,
    maxCompareAtPrice,
    discountPercentage: calculateDiscountPercentage(minPrice, maxCompareAtPrice),
    rating: product.rating,
    reviewCount: product.reviewCount,
    availableSizes: [...new Set(activeVariants.map((variant) => variant.size))],
    availableColors: [...new Set(activeVariants.map((variant) => variant.color))],
    ageGroups: [...new Set(activeVariants.map((variant) => variant.ageGroup))],
    inStock: activeVariants.some((variant) => variant.stockQuantity > 0),
    isFeatured: product.isFeatured,
  };
}

function matchesFilters(product: Product, filters: ProductListFilters): boolean {
  if (!product.isActive) return false;

  if (filters.categorySlug) {
    const category = getCategoryBySlug(filters.categorySlug);
    if (!category || product.categoryId !== category.id) return false;
  }

  if (filters.q) {
    const query = filters.q.toLowerCase();
    const haystack = `${product.name} ${product.brand} ${product.shortDescription}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  const summary = toProductSummary(product);

  if (filters.minPrice !== undefined && summary.minPrice < filters.minPrice) return false;
  if (filters.maxPrice !== undefined && summary.minPrice > filters.maxPrice) return false;

  if (filters.sizes && filters.sizes.length > 0) {
    const hasSize = filters.sizes.some((size) => summary.availableSizes.includes(size));
    if (!hasSize) return false;
  }

  if (filters.colors && filters.colors.length > 0) {
    const hasColor = filters.colors.some((color) => summary.availableColors.includes(color));
    if (!hasColor) return false;
  }

  if (filters.ageGroups && filters.ageGroups.length > 0) {
    const hasAgeGroup = filters.ageGroups.some((ageGroup) => summary.ageGroups.includes(ageGroup));
    if (!hasAgeGroup) return false;
  }

  if (filters.brands && filters.brands.length > 0) {
    if (!filters.brands.includes(product.brand)) return false;
  }

  if (filters.minRating !== undefined && product.rating < filters.minRating) return false;

  if (filters.onSaleOnly && summary.discountPercentage === null) return false;

  return true;
}

function sortSummaries(
  summaries: ProductSummary[],
  sort: ProductListFilters["sort"],
): ProductSummary[] {
  const sorted = [...summaries];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.minPrice - b.minPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.minPrice - a.minPrice);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "best-selling":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
    case "relevance":
    default:
      return sorted;
  }
}

export function listProducts(filters: ProductListFilters): PaginatedResult<ProductSummary> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  const filtered = PRODUCTS.filter((product) => matchesFilters(product, filters));
  const summaries = sortSummaries(filtered.map(toProductSummary), filters.sort);

  const total = summaries.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = summaries.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export function getProductBySlug(slug: string): Product | null {
  return PRODUCTS.find((product) => product.slug === slug && product.isActive) ?? null;
}

export function getProductById(id: string): Product | null {
  return PRODUCTS.find((product) => product.id === id) ?? null;
}

export interface VariantWithProduct {
  product: Product;
  variant: Product["variants"][number];
}

export function getVariantWithProduct(variantId: string): VariantWithProduct | null {
  for (const product of PRODUCTS) {
    const variant = product.variants.find((candidate) => candidate.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

export function listRelatedProducts(product: Product, limit = 4): ProductSummary[] {
  return PRODUCTS.filter(
    (candidate) => candidate.categoryId === product.categoryId && candidate.id !== product.id,
  )
    .slice(0, limit)
    .map(toProductSummary);
}

export function listFeaturedProducts(limit = 8): ProductSummary[] {
  return PRODUCTS.filter((product) => product.isFeatured && product.isActive)
    .slice(0, limit)
    .map(toProductSummary);
}

export function getProductFacets(categorySlug?: string): ProductFacets {
  const category = categorySlug ? getCategoryBySlug(categorySlug) : null;
  const scoped = category
    ? PRODUCTS.filter((product) => product.categoryId === category.id)
    : PRODUCTS;

  const summaries = scoped.map(toProductSummary);
  const prices = summaries.map((summary) => summary.minPrice);

  const colorMap = new Map<string, string>();
  for (const product of scoped) {
    for (const variant of product.variants) {
      colorMap.set(variant.color, variant.colorHex);
    }
  }

  return {
    brands: [...new Set(scoped.map((product) => product.brand))].sort(),
    sizes: [...new Set(summaries.flatMap((summary) => summary.availableSizes))],
    colors: [...colorMap.entries()].map(([name, hex]) => ({ name, hex })),
    ageGroups: [...new Set(summaries.flatMap((summary) => summary.ageGroups))],
    priceRange: {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
    },
  };
}

export function listAllProductsForAdmin(): Product[] {
  return PRODUCTS;
}

export function createProduct(input: Omit<Product, "id" | "createdAt">): Product {
  const product: Product = {
    ...input,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  PRODUCTS.push(product);
  return product;
}

export function updateProduct(productId: string, updates: Partial<Omit<Product, "id">>): Product | null {
  const product = getProductById(productId);
  if (!product) return null;
  Object.assign(product, updates);
  return product;
}

export function deleteProduct(productId: string): boolean {
  const index = PRODUCTS.findIndex((product) => product.id === productId);
  if (index === -1) return false;
  PRODUCTS.splice(index, 1);
  return true;
}

export function adjustVariantStock(
  variantId: string,
  newStockQuantity: number,
): { product: Product; variant: ProductVariant } | null {
  const match = getVariantWithProduct(variantId);
  if (!match) return null;
  match.variant.stockQuantity = newStockQuantity;
  return match;
}

export { toProductSummary };
