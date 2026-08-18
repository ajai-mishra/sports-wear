import Link from "next/link";

import type { Category } from "@/types/category.types";

export function DesktopNav({ categories }: { categories: Category[] }) {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Categories">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {category.name}
        </Link>
      ))}
      <Link
        href="/search?onSaleOnly=true"
        className="rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
      >
        Sale
      </Link>
    </nav>
  );
}
