"use client";

import { Logo } from "@/components/layout/logo";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchBar } from "@/components/layout/search-bar";
import { AccountMenu } from "@/components/layout/account-menu";
import { CartButton } from "@/components/layout/cart-button";
import { WishlistButton } from "@/components/layout/wishlist-button";
import { CartDrawer } from "@/components/cart/cart-drawer";
import type { Category } from "@/types/category.types";

export function SiteHeader({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="bg-gradient-to-r from-orange-700 via-primary to-orange-600 py-1.5 text-center text-xs font-medium tracking-wide text-primary-foreground">
        Free shipping on orders over ₹2,000 · New season arrivals now live
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <MobileNav categories={categories} />
        <Logo />
        <div className="hidden flex-1 justify-center px-6 md:flex">
          <SearchBar className="max-w-md" />
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <WishlistButton />
          <CartButton />
          <AccountMenu />
        </div>
      </div>
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <DesktopNav categories={categories} />
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <SearchBar />
      </div>
      <CartDrawer />
    </header>
  );
}
