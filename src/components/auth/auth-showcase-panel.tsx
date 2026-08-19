import Image from "next/image";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { categoryImageUrl } from "@/mocks/data/image-url.util";

const HIGHLIGHTS = [
  { icon: Truck, label: "Free shipping over ₹2,000" },
  { icon: RotateCcw, label: "50-day hassle-free returns" },
  { icon: ShieldCheck, label: "Secure checkout, every time" },
];

interface AuthShowcasePanelProps {
  headline: string;
  description: string;
  categoryId: string;
}

/** Full-bleed image hero shown beside the form on /login and /signup — hidden below `lg` so the form stays the sole focus on small screens. */
export function AuthShowcasePanel({ headline, description, categoryId }: AuthShowcasePanelProps) {
  return (
    <div className="relative hidden w-1/2 shrink-0 overflow-hidden lg:block">
      <Image
        src={categoryImageUrl(categoryId, 1200, 1600)}
        alt=""
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-10 text-white">
        <Logo className="text-white" />

        <div className="max-w-md space-y-6">
          <div className="space-y-3">
            <h2 className="font-heading text-3xl leading-tight font-bold text-balance sm:text-4xl">
              {headline}
            </h2>
            <p className="text-white/80">{description}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm"
              >
                <Icon className="size-4 shrink-0 text-primary" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
