export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
}

export enum DiscountScope {
  PRODUCT = "PRODUCT",
  CATEGORY = "CATEGORY",
  STOREWIDE = "STOREWIDE",
}

export interface Discount {
  id: string;
  name: string;
  type: DiscountType;
  scope: DiscountScope;
  targetId: string | null;
  value: number;
  couponCode: string | null;
  maxRedemptions: number | null;
  redeemedCount: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}
