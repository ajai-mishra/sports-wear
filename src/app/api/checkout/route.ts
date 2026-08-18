import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { apiErrorResponse } from "@/lib/api/api-error";
import { getSessionFromRequest } from "@/lib/auth/route-guards";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/constants";
import { checkoutSchema } from "@/lib/validation/checkout.schema";
import { calculateDiscountAmount, validateCoupon } from "@/services/discount.service";
import { createOrder } from "@/services/order.service";
import { getVariantWithProduct } from "@/services/product.service";
import type { OrderLineItem } from "@/types/order.types";

/**
 * This is the payment-gate endpoint. A valid session is required before an
 * order can be created — enforced here, not just by the /checkout/* proxy
 * redirect, because the redirect is only a UX nicety a forged request can
 * skip straight past. The real NestJS PaymentController will apply the same
 * rule against a verified JWT plus order-ownership check.
 */
export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return apiErrorResponse("UNAUTHENTICATED", "You must be signed in to complete payment.");
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return apiErrorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const orderItems: OrderLineItem[] = [];
  let subtotal = 0;

  for (const item of parsed.data.items) {
    const match = getVariantWithProduct(item.variantId);
    if (!match) {
      return apiErrorResponse("VALIDATION_ERROR", `Unknown product variant "${item.variantId}".`);
    }
    if (match.variant.stockQuantity < item.quantity) {
      return apiErrorResponse(
        "CONFLICT",
        `Only ${match.variant.stockQuantity} left in stock for ${match.product.name} (${match.variant.size}, ${match.variant.color}).`,
      );
    }

    // Prices are always re-derived from the catalog here, never trusted from
    // the client — otherwise a tampered request could check out at any price.
    subtotal += match.variant.price * item.quantity;
    orderItems.push({
      variantId: match.variant.id,
      productId: match.product.id,
      productSlug: match.product.slug,
      productName: match.product.name,
      imageUrl: match.product.images[0]?.url ?? "",
      size: match.variant.size,
      color: match.variant.color,
      unitPrice: match.variant.price,
      quantity: item.quantity,
    });
  }

  let discountAmount = 0;
  if (parsed.data.couponCode) {
    const discount = validateCoupon(parsed.data.couponCode);
    if (!discount) {
      return apiErrorResponse("VALIDATION_ERROR", "This coupon code is invalid or has expired.");
    }
    discountAmount = calculateDiscountAmount(discount, subtotal);
  }

  const shippingFee = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

  const order = createOrder({
    userId: session.userId,
    items: orderItems,
    subtotal,
    discountAmount,
    shippingFee,
    couponCode: parsed.data.couponCode ?? null,
    shippingAddress: {
      id: `addr-checkout-${Date.now()}`,
      userId: session.userId,
      isDefault: false,
      line2: null,
      ...parsed.data.shippingAddress,
    },
  });

  return NextResponse.json({ order }, { status: 201 });
}
