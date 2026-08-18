import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2 font-heading text-xl font-bold tracking-tight", className)}
    >
      <span
        className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-700 text-primary-foreground shadow-md shadow-primary/30 transition-transform group-hover:scale-105"
        aria-hidden="true"
      >
        S
      </span>
      <span className="sr-only sm:not-sr-only">
        Sports <span className="text-primary">Wear</span>
      </span>
    </Link>
  );
}
