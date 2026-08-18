import type { Metadata, Viewport } from "next";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
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
