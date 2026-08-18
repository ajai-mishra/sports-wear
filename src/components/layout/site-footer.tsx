import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import type { Category } from "@/types/category.types";

interface SiteFooterProps {
  categories: Category[];
}

const FOOTER_LINK_CLASSES =
  "text-sm text-zinc-400 transition-colors hover:text-primary";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white uppercase">
      <span className="h-3.5 w-1 rounded-full bg-primary" aria-hidden="true" />
      {children}
    </h3>
  );
}

export function SiteFooter({ categories }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="h-1 bg-gradient-to-r from-orange-700 via-primary to-orange-600" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-4 md:col-span-1">
          <Logo className="text-zinc-100" />
          <p className="text-sm text-zinc-400">
            Track suits, sportswear, footwear, and equipment for every athlete.
          </p>
          <div className="flex flex-col gap-2 pt-1">
            <a
              href="mailto:support@sportswear.example"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Mail className="size-4" aria-hidden="true" /> support@sportswear.example
            </a>
            <a
              href="tel:+911234567890"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Phone className="size-4" aria-hidden="true" /> +91 12345 67890
            </a>
          </div>
        </div>

        <div>
          <FooterHeading>Shop</FooterHeading>
          <ul className="mt-4 space-y-2.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`} className={FOOTER_LINK_CLASSES}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Help</FooterHeading>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/faq" className={FOOTER_LINK_CLASSES}>
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className={FOOTER_LINK_CLASSES}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className={FOOTER_LINK_CLASSES}>
                Track an Order
              </Link>
            </li>
            <li>
              <Link href="/account/returns" className={FOOTER_LINK_CLASSES}>
                Returns & Refunds
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <FooterHeading>Company</FooterHeading>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/about" className={FOOTER_LINK_CLASSES}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className={FOOTER_LINK_CLASSES}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className={FOOTER_LINK_CLASSES}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/shipping-returns" className={FOOTER_LINK_CLASSES}>
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-900 py-4">
        <p className="text-center text-xs text-zinc-500">
          © {currentYear} Sports Wear. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
