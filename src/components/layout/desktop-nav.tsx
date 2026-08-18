import Link from "next/link";

import type { Category } from "@/types/category.types";

export function DesktopNav({ categories }: { categories: Category[] }) {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Categories">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="relative rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100"
        >
          {category.name}
        </Link>
      ))}
      <Link
        href="/search?onSaleOnly=true"
        className="ml-1 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition-transform hover:scale-105"
      >
        Sale
      </Link>
    </nav>
  );
}
