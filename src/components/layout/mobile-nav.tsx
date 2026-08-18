"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/layout/search-bar";
import { useUiStore } from "@/store/ui.store";
import type { Category } from "@/types/category.types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const isOpen = useUiStore((state) => state.isMobileNavOpen);
  const setOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-muted/70 hover:bg-primary hover:text-primary-foreground lg:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
          <SearchBar />
          <nav className="flex flex-col gap-1" aria-label="Categories">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
              >
                {category.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border pt-4">
            <Link
              href="/search?onSaleOnly=true"
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-muted"
            >
              On Sale
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
