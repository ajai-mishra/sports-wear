import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight">
      <span
        className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
        aria-hidden="true"
      >
        S
      </span>
      <span className="sr-only sm:not-sr-only">Sports Wear</span>
    </Link>
  );
}
