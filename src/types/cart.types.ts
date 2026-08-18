export interface CartLineItem {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  brand: string;
  imageUrl: string;
  size: string;
  color: string;
  unitPrice: number;
  compareAtPrice: number | null;
  quantity: number;
  stockQuantity: number;
}

export interface WishlistItem {
  productId: string;
  productSlug: string;
  productName: string;
  brand: string;
  imageUrl: string;
  price: number;
  compareAtPrice: number | null;
  addedAt: string;
}
