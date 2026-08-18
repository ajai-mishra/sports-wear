import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { validateCouponSchema } from "@/lib/validation/cart.schema";
import { calculateDiscountAmount, validateCoupon } from "@/services/discount.service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = validateCouponSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const discount = validateCoupon(parsed.data.code);
  if (!discount) {
    return apiErrorResponse("VALIDATION_ERROR", "This coupon code is invalid or has expired.");
  }

  const discountAmount = calculateDiscountAmount(discount, parsed.data.subtotal);
  return NextResponse.json({ discount, discountAmount });
}
