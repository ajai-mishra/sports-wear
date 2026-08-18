import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <SearchX className="size-12 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        We couldn&apos;t find the page you&apos;re looking for. It may have been moved or no longer exists.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link href="/" />} nativeButton={false}>
          Back to home
        </Button>
        <Button variant="outline" render={<Link href="/search" />} nativeButton={false}>
          Search products
        </Button>
      </div>
    </div>
  );
}
