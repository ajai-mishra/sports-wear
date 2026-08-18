import { DiscountScope, DiscountType, type Discount } from "@/types/discount.types";
import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";

const now = () => new Date();
const daysFromNow = (days: number) => {
  const date = now();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const DISCOUNTS: Discount[] = getOrCreateGlobalSingleton("discounts", () => [
  {
    id: "disc-flash-sale-storewide",
    name: "End of Season Flash Sale",
    type: DiscountType.PERCENTAGE,
    scope: DiscountScope.STOREWIDE,
    targetId: null,
    value: 15,
    couponCode: null,
    maxRedemptions: null,
    redeemedCount: 0,
    startsAt: daysFromNow(-2),
    endsAt: daysFromNow(3),
    isActive: true,
  },
  {
    id: "disc-footwear-category",
    name: "Footwear Week",
    type: DiscountType.PERCENTAGE,
    scope: DiscountScope.CATEGORY,
    targetId: "cat-footwear",
    value: 20,
    couponCode: null,
    maxRedemptions: null,
    redeemedCount: 0,
    startsAt: daysFromNow(-1),
    endsAt: daysFromNow(6),
    isActive: true,
  },
  {
    id: "disc-welcome-coupon",
    name: "Welcome Offer",
    type: DiscountType.FLAT,
    scope: DiscountScope.STOREWIDE,
    targetId: null,
    value: 200,
    couponCode: "WELCOME200",
    maxRedemptions: 1000,
    redeemedCount: 128,
    startsAt: daysFromNow(-30),
    endsAt: daysFromNow(60),
    isActive: true,
  },
  {
    id: "disc-kids-category",
    name: "Back to School — Kids Sportswear",
    type: DiscountType.PERCENTAGE,
    scope: DiscountScope.CATEGORY,
    targetId: "cat-kids-sportswear",
    value: 10,
    couponCode: "SCHOOL10",
    maxRedemptions: 500,
    redeemedCount: 42,
    startsAt: daysFromNow(-10),
    endsAt: daysFromNow(20),
    isActive: true,
  },
]);
