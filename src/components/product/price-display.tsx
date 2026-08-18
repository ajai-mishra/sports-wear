import { formatCurrency } from "@/lib/currency.utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<PriceDisplayProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function PriceDisplay({ price, compareAtPrice, size = "md", className }: PriceDisplayProps) {
  const hasDiscount = compareAtPrice !== null && compareAtPrice !== undefined && compareAtPrice > price;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-foreground", SIZE_CLASSES[size])}>
        {formatCurrency(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">{formatCurrency(compareAtPrice)}</span>
      )}
    </div>
  );
}
