import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import "./globals.css";
import { Providers } from "@/app/providers";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { listCategories } from "@/services/category.service";

export const metadata: Metadata = {
  title: {
    default: "Sports Wear — Track Suits, Sportswear & Sports Equipment",
    template: "%s | Sports Wear",
  },
  description:
    "Shop track suits, jerseys, footwear, socks, and sports equipment for every age group.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#F2622E",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Reading headers() (the per-request nonce proxy.ts sets on every request)
  // forces this layout — and therefore every route under it — to render
  // dynamically instead of being statically prerendered. That's required:
  // a statically-generated page bakes in whatever nonce existed at build
  // time into its script tags, but proxy.ts's CSP response header carries a
  // freshly random nonce on every request. Those two values only match when
  // the page is rendered live per-request, so without this, browsers block
  // every script on any static page (the homepage among them) with a CSP
  // violation — the page renders but never hydrates, so nothing is clickable.
  await headers();
  const categories = listCategories();

  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        <Providers>
          <ServiceWorkerRegister />
          <SiteHeader categories={categories} />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter categories={categories} />
        </Providers>
      </body>
    </html>
  );
}
