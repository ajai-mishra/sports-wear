export enum AgeGroup {
  KIDS = "KIDS",
  TEEN = "TEEN",
  ADULT = "ADULT",
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  ageGroup: AgeGroup;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  reorderThreshold: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  sizeGuide: string;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  imageUrl: string;
  imageAlt: string;
  minPrice: number;
  maxCompareAtPrice: number | null;
  discountPercentage: number | null;
  rating: number;
  reviewCount: number;
  availableSizes: string[];
  availableColors: string[];
  ageGroups: AgeGroup[];
  inStock: boolean;
  isFeatured: boolean;
}

export type ProductSortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "best-selling"
  | "rating";

export interface ProductListFilters {
  categorySlug?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  ageGroups?: AgeGroup[];
  brands?: string[];
  minRating?: number;
  onSaleOnly?: boolean;
  sort?: ProductSortOption;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFacets {
  brands: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  ageGroups: AgeGroup[];
  priceRange: { min: number; max: number };
}
