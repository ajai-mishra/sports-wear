import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/constants";
import { formatCurrency } from "@/lib/currency.utils";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Delivery timelines, shipping fees, and our 7-day return and refund policy.",
};

export default function ShippingReturnsPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Shipping &amp; Returns</h1>
          <p className="text-sm text-muted-foreground">Last updated: 1 August 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Delivery Timelines</h2>
            <p>
              Orders are typically processed and shipped within 1–2 business days. Once shipped, delivery
              usually takes 3–5 business days in metro cities and 5–7 business days elsewhere across India.
              You&apos;ll receive a tracking link by email as soon as your order leaves our warehouse, and you
              can always check live status from{" "}
              <Link href="/account/orders" className="underline underline-offset-2">
                Order History
              </Link>{" "}
              in your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Shipping Fees</h2>
            <p>
              Shipping is <span className="text-foreground">free on all orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}</span>.
              Orders below that amount carry a flat shipping fee of {formatCurrency(STANDARD_SHIPPING_FEE)},
              calculated automatically at checkout regardless of order weight or destination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Returns &amp; Exchanges</h2>
            <p>
              We offer a <span className="text-foreground">7-day return window</span>, starting from the date
              your order is delivered. To be eligible, items must be unworn, unwashed, and returned in their
              original packaging with all tags attached. You can start a return from{" "}
              <Link href="/account/returns" className="underline underline-offset-2">
                Returns &amp; Refunds
              </Link>{" "}
              in your account — select the order and item, choose a reason, and we&apos;ll arrange a pickup or
              provide a return shipping label depending on your location.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Non-Returnable Items</h2>
            <p>
              For hygiene reasons, innerwear and socks cannot be returned or exchanged once the packaging has
              been opened, unless the item arrived damaged or defective. This exception is noted on the relevant
              product pages at checkout.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Refund Processing</h2>
            <p>
              Once we receive and inspect a returned item, refunds are issued to your original payment method
              within 5–7 business days. For exchanges, the replacement item ships as soon as the return passes
              inspection, or immediately if you choose our reverse-pickup exchange option. You&apos;ll get an
              email confirmation at each step.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Damaged or Incorrect Items</h2>
            <p>
              If an item arrives damaged, defective, or different from what you ordered, contact us within 48
              hours of delivery through the{" "}
              <Link href="/contact" className="underline underline-offset-2">
                Contact page
              </Link>{" "}
              with your order number and photos of the item. We&apos;ll prioritize a free replacement or full
              refund — no return shipping cost to you in these cases.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Questions</h2>
            <p>
              For anything not covered here, email{" "}
              <a href="mailto:support@sportswear.example" className="underline underline-offset-2">
                support@sportswear.example
              </a>{" "}
              or call{" "}
              <a href="tel:+911234567890" className="underline underline-offset-2">
                +91 12345 67890
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
