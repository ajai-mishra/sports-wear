import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Sports Wear collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: 1 August 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect the following categories of information when you use Sports Wear:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <span className="text-foreground">Account information</span> — your name, email address, phone
                number, and delivery addresses.
              </li>
              <li>
                <span className="text-foreground">Order history</span> — items purchased, order values, payment
                status, and return or exchange records.
              </li>
              <li>
                <span className="text-foreground">Cookies &amp; usage data</span> — pages visited, cart
                contents, and device/browser information collected via cookies and similar technologies.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Process and deliver your orders, including returns and exchanges.</li>
              <li>Keep your account secure and let you sign in and track orders.</li>
              <li>Send order confirmations, shipping updates, and support responses.</li>
              <li>Improve the site&apos;s performance, sizing guidance, and product catalogue.</li>
              <li>Detect and prevent fraud or abuse of the platform.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Third-Party Sharing</h2>
            <p>
              We do not sell your personal information. We share only the minimum data necessary with our
              payment processor to securely authorize and complete transactions — we never store your full card
              or bank details ourselves. We may also share delivery details (name, address, phone number) with
              our shipping and logistics partners solely to fulfil your order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Data Retention</h2>
            <p>
              We retain account and order information for as long as your account is active, and for a
              reasonable period afterward to comply with tax, accounting, and consumer protection obligations.
              You can request deletion of your account at any time, as described below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Access a copy of the personal information we hold about you.</li>
              <li>Correct inaccurate or outdated account details.</li>
              <li>Request deletion of your account and associated personal data.</li>
              <li>Opt out of non-essential marketing communications at any time.</li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a href="mailto:support@sportswear.example" className="underline underline-offset-2">
                support@sportswear.example
              </a>{" "}
              from your registered email address.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Cookie Policy</h2>
            <p>
              We use essential cookies to keep you signed in and remember your cart contents, and analytics
              cookies to understand how the site is used so we can improve it. You can control or disable
              cookies through your browser settings, though some site features — like staying signed in — may
              not work correctly without them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Contact Us</h2>
            <p>
              For any privacy-related questions, reach us at{" "}
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
