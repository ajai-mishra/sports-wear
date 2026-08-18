import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions that govern your use of the Sports Wear website and orders.",
};

export default function TermsOfServicePage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: 1 August 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Sports Wear website, creating an account, or placing an order, you agree
              to be bound by these Terms of Service. If you do not agree with any part of these terms, please
              do not use this site. We may update these terms from time to time, and continued use of the site
              after changes are posted means you accept the revised terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Account Responsibilities</h2>
            <p>
              A free account is required to complete checkout. You are responsible for maintaining the
              confidentiality of your login credentials and for all activity that occurs under your account. You
              agree to provide accurate, current, and complete information when creating an account and to keep
              it updated. Notify us immediately at{" "}
              <a href="mailto:support@sportswear.example" className="underline underline-offset-2">
                support@sportswear.example
              </a>{" "}
              if you suspect unauthorized use of your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Pricing &amp; Availability</h2>
            <p>
              All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated
              otherwise. We make reasonable efforts to ensure prices and stock levels shown on the site are
              accurate, but errors can occur. If an item is listed at an incorrect price or is out of stock
              after you place an order, we will contact you before charging or shipping and offer a correction,
              substitution, or full refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Order Acceptance &amp; Cancellation</h2>
            <p>
              Placing an order is an offer to purchase, which we may accept or decline at our discretion — for
              example, in cases of suspected fraud, pricing errors, or unavailable inventory. We will notify you
              if an order cannot be fulfilled. You may cancel an order yourself from your account&apos;s Order
              History page any time before it has shipped; once an order has shipped, cancellation is no longer
              possible and our standard return process applies instead.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Prohibited Uses</h2>
            <p>You agree not to use the Sports Wear website to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Violate any applicable law or regulation.</li>
              <li>Submit fraudulent orders or payment information.</li>
              <li>Attempt to gain unauthorized access to other accounts or to our systems.</li>
              <li>Scrape, resell, or republish site content without written permission.</li>
              <li>Interfere with or disrupt the site&apos;s security or normal operation.</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Sports Wear will not be liable for any indirect,
              incidental, or consequential damages arising from your use of the site or products purchased
              through it, including but not limited to loss of data, delayed delivery, or product misuse. Our
              total liability for any claim relating to an order is limited to the amount you paid for that
              order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Governing Law</h2>
            <p>
              These Terms of Service are governed by the laws of India. Any disputes arising from these terms or
              your use of the site will be subject to the exclusive jurisdiction of the courts of Pune,
              Maharashtra.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">8. Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a href="mailto:support@sportswear.example" className="underline underline-offset-2">
                support@sportswear.example
              </a>{" "}
              or via our{" "}
              <Link href="/contact" className="underline underline-offset-2">
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
