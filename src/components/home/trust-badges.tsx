import { Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const TRUST_BADGES = [
  { icon: Truck, title: "Free Shipping", description: "On orders over ₹2,000" },
  { icon: RotateCcw, title: "Easy Returns", description: "7-day return window" },
  { icon: ShieldCheck, title: "Secure Payments", description: "100% protected checkout" },
  { icon: Headset, title: "Support", description: "We're here to help" },
] as const;

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {TRUST_BADGES.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center">
          <Icon className="size-6 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
