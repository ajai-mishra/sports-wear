import { Badge } from "@/components/ui/badge";

export function DiscountBadge({ percentage }: { percentage: number }) {
  return (
    <Badge className="border-transparent bg-primary text-primary-foreground">
      {percentage}% OFF
    </Badge>
  );
}
