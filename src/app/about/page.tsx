import type { Metadata } from "next";
import { Award, Headset, Package, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Sports Wear — gear for every athlete, at every level, across India.",
};

const STATS = [
  { icon: Award, value: "10,000+", label: "Athletes served" },
  { icon: Package, value: "50+", label: "Cities delivered to" },
  { icon: Truck, value: "₹2,000", label: "Free shipping threshold" },
  { icon: RotateCcw, value: "7 days", label: "Easy return window" },
] as const;

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Authentic gear, always",
    description:
      "Every track suit, jersey, and pair of shoes we sell is sourced directly from the brand or an authorized distributor. No knockoffs, no grey-market stock.",
  },
  {
    icon: Truck,
    title: "Built for Pan-India delivery",
    description:
      "From metros to tier-2 towns, our logistics partners get your order to your doorstep quickly, with tracking every step of the way.",
  },
  {
    icon: Headset,
    title: "Real people, real support",
    description:
      "Sizing question at 9pm before a match? Our support team answers within one business day, every day of the week.",
  },
] as const;

export default function AboutPage() {
  return (
    <PageContainer className="flex flex-col gap-12 py-10 sm:gap-16 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Sports Wear</h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          We started Sports Wear with one goal: make it simple for Indian athletes, weekend players, and school
          teams to find gear that actually performs — without paying import prices or guessing at sizes from
          overseas charts.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          What began as a single stall selling track suits at a Pune sports complex has grown into a full
          catalogue of track suits, jerseys, footwear, socks, and training equipment — curated for the way
          Indian athletes actually train, travel, and compete. We work with academies, school sports
          departments, and weekend runners alike, which means every product on this site has been tried out by
          someone who actually plays the sport.
        </p>
        <p>
          We&apos;re not trying to be everything to everyone. We stock what holds up to daily training, humid
          summers, and the kind of washing machine abuse that comes with playing sport several times a week —
          and we back it with sizing guidance, honest product descriptions, and a return window that doesn&apos;t
          punish you for guessing wrong on fit.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-5 text-center"
          >
            <Icon className="size-6 text-primary" aria-hidden="true" />
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">What we stand for</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-2 rounded-lg border border-border p-5">
              <Icon className="size-5 text-primary" aria-hidden="true" />
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
