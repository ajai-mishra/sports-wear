import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  viewAllHref?: string;
}

export function SectionHeading({ title, description, viewAllHref }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all <ChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
