import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import type { Category } from "@/types/category.types";

interface SiteFooterProps {
  categories: Category[];
}

export function SiteFooter({ categories }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-3 md:col-span-1">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Track suits, sportswear, footwear, and equipment for every athlete.
          </p>
          <div className="space-y-1.5 pt-2 text-sm text-muted-foreground">
            <a href="mailto:support@sportswear.example" className="flex items-center gap-2 hover:text-foreground">
              <Mail className="size-4" aria-hidden="true" /> support@sportswear.example
            </a>
            <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-foreground">
              <Phone className="size-4" aria-hidden="true" /> +91 12345 67890
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Shop</h3>
          <ul className="mt-3 space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Help</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-foreground">
                Track an Order
              </Link>
            </li>
            <li>
              <Link href="/account/returns" className="text-sm text-muted-foreground hover:text-foreground">
                Returns & Refunds
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/shipping-returns" className="text-sm text-muted-foreground hover:text-foreground">
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          © {currentYear} Sports Wear. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
