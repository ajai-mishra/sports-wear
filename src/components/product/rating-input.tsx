"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHoverValue(0)}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            aria-label={`Rate ${starValue} out of 5 stars`}
            onMouseEnter={() => setHoverValue(starValue)}
            onClick={() => onChange(starValue)}
            className="p-0.5"
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                displayValue >= starValue ? "fill-primary text-primary" : "fill-transparent text-muted-foreground",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
