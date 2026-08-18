import { DISCOUNTS } from "@/mocks/data/discounts.data";
import { DiscountScope, DiscountType, type Discount } from "@/types/discount.types";

function isCurrentlyActive(discount: Discount): boolean {
  const now = Date.now();
  return (
    discount.isActive &&
    new Date(discount.startsAt).getTime() <= now &&
    new Date(discount.endsAt).getTime() >= now
  );
}

export function listActiveDiscounts(): Discount[] {
  return DISCOUNTS.filter(isCurrentlyActive);
}

export function getStorewideDiscount(): Discount | null {
  return (
    listActiveDiscounts().find((discount) => discount.scope === DiscountScope.STOREWIDE && !discount.couponCode) ??
    null
  );
}

export function getCategoryDiscount(categoryId: string): Discount | null {
  return (
    listActiveDiscounts().find(
      (discount) => discount.scope === DiscountScope.CATEGORY && discount.targetId === categoryId,
    ) ?? null
  );
}

export function validateCoupon(code: string): Discount | null {
  const normalizedCode = code.trim().toUpperCase();
  const discount = listActiveDiscounts().find(
    (candidate) => candidate.couponCode?.toUpperCase() === normalizedCode,
  );
  if (!discount) return null;
  if (discount.maxRedemptions !== null && discount.redeemedCount >= discount.maxRedemptions) {
    return null;
  }
  return discount;
}

export function calculateDiscountAmount(discount: Discount, subtotal: number): number {
  if (discount.type === DiscountType.PERCENTAGE) {
    return Math.round((subtotal * discount.value) / 100);
  }
  return Math.min(discount.value, subtotal);
}

export function listAllDiscounts(): Discount[] {
  return DISCOUNTS;
}

export function createDiscount(input: Omit<Discount, "id" | "redeemedCount">): Discount {
  const discount: Discount = { ...input, id: `disc-${Date.now()}`, redeemedCount: 0 };
  DISCOUNTS.push(discount);
  return discount;
}

export function updateDiscount(discountId: string, updates: Partial<Omit<Discount, "id">>): Discount | null {
  const discount = DISCOUNTS.find((candidate) => candidate.id === discountId);
  if (!discount) return null;
  Object.assign(discount, updates);
  return discount;
}

export function deleteDiscount(discountId: string): boolean {
  const index = DISCOUNTS.findIndex((discount) => discount.id === discountId);
  if (index === -1) return false;
  DISCOUNTS.splice(index, 1);
  return true;
}
