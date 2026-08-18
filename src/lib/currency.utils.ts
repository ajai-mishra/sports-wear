export const CURRENCY_CODE = "INR";
export const CURRENCY_LOCALE = "en-IN";

const currencyFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: CURRENCY_CODE,
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function calculateDiscountPercentage(
  price: number,
  compareAtPrice: number | null,
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
