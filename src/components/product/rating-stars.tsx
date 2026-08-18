import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, reviewCount, size = "sm", className }: RatingStarsProps) {
  const starSizeClass = size === "sm" ? "size-3.5" : "size-4";
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex" role="img" aria-label={`Rated ${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isFilled = roundedRating >= starValue;
          const isHalfFilled = !isFilled && roundedRating + 0.5 === starValue;
          return (
            <Star
              key={starValue}
              className={cn(
                starSizeClass,
                isFilled ? "fill-primary text-primary" : "fill-transparent text-muted-foreground",
                isHalfFilled && "fill-primary/50 text-primary",
              )}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
