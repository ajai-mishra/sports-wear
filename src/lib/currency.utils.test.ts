import { describe, expect, it } from "vitest";

import { calculateDiscountPercentage, formatCurrency } from "@/lib/currency.utils";

describe("formatCurrency", () => {
  it("should format a whole number as INR currency", () => {
    expect(formatCurrency(2999)).toBe("₹2,999");
  });

  it("should round to the nearest rupee with no decimals", () => {
    expect(formatCurrency(1000)).toBe("₹1,000");
  });
});

describe("calculateDiscountPercentage", () => {
  it("should return null when there is no compareAtPrice", () => {
    expect(calculateDiscountPercentage(999, null)).toBeNull();
  });

  it("should return null when compareAtPrice is not greater than price", () => {
    expect(calculateDiscountPercentage(999, 999)).toBeNull();
  });

  it("should return the rounded percentage discount when compareAtPrice is greater", () => {
    expect(calculateDiscountPercentage(750, 1000)).toBe(25);
  });
});
