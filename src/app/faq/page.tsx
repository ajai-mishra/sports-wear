import type { Metadata } from "next";
import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageContainer } from "@/components/shared/page-container";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/constants";
import { formatCurrency } from "@/lib/currency.utils";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about shipping, returns, sizing, payments, and orders.",
};

const FAQ_ITEMS = [
  {
    value: "shipping-times",
    question: "How long does shipping take, and how much does it cost?",
    answer: (
      <p>
        Most orders ship within 1–2 business days and arrive in 3–7 business days depending on your location.
        Shipping is free on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}; below that, a flat{" "}
        {formatCurrency(STANDARD_SHIPPING_FEE)} shipping fee applies at checkout. See our{" "}
        <Link href="/legal/shipping-returns">Shipping &amp; Returns policy</Link> for full details.
      </p>
    ),
  },
  {
    value: "returns-exchanges",
    question: "What's your return and exchange window?",
    answer: (
      <p>
        You can return most items within 7 days of delivery for a refund or exchange, as long as they&apos;re
        unworn, unwashed, and in their original packaging with tags attached. Innerwear and socks aren&apos;t
        eligible for return for hygiene reasons. Full details are in our{" "}
        <Link href="/legal/shipping-returns">Shipping &amp; Returns policy</Link>.
      </p>
    ),
  },
  {
    value: "track-order",
    question: "How do I track my order?",
    answer: (
      <p>
        Once your order ships, you&apos;ll get a tracking link by email. You can also view live status anytime from{" "}
        <Link href="/account/orders">Order History</Link> in your account.
      </p>
    ),
  },
  {
    value: "payment-methods",
    question: "What payment methods do you accept?",
    answer: <p>We accept all major credit and debit cards, UPI, net banking, and popular wallets at checkout.</p>,
  },
  {
    value: "sizing-guide",
    question: "How do I pick the right size?",
    answer: (
      <p>
        Every product page includes a size guide with measurements in centimetres and inches. If you&apos;re between
        sizes or unsure, our support team is happy to advise — reach out through the{" "}
        <Link href="/contact">Contact</Link> page before you order.
      </p>
    ),
  },
  {
    value: "guest-checkout",
    question: "Can I check out as a guest?",
    answer: (
      <p>
        You can browse and build your cart freely, but you&apos;ll need a free account to complete checkout — this
        keeps order tracking and returns simple. Creating an account takes less than a minute.
      </p>
    ),
  },
  {
    value: "coupon-codes",
    question: "How do I apply a coupon code?",
    answer: (
      <p>
        Enter your code in the &quot;Coupon code&quot; field on the cart or checkout page and select Apply. The
        discount will reflect in your order total before you confirm payment. Only one coupon can be used per
        order.
      </p>
    ),
  },
  {
    value: "cancel-modify-order",
    question: "Can I cancel or modify an order after placing it?",
    answer: (
      <p>
        You can cancel an order from <Link href="/account/orders">Order History</Link> as long as it hasn&apos;t
        shipped yet. Once it&apos;s shipped, you&apos;ll need to use our standard return process instead.
      </p>
    ),
  },
  {
    value: "contact-support",
    question: "How do I contact support?",
    answer: (
      <p>
        Email us at <a href="mailto:support@sportswear.example">support@sportswear.example</a>, call{" "}
        <a href="tel:+911234567890">+91 12345 67890</a>, or use the form on our{" "}
        <Link href="/contact">Contact</Link> page. We reply within one business day.
      </p>
    ),
  },
] as const;

export default function FaqPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Everything you need to know about shopping with Sports Wear.</p>
        </div>

        <Accordion>
          {FAQ_ITEMS.map(({ value, question, answer }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageContainer>
  );
}
