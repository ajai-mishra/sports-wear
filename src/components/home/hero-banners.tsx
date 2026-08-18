import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Banner } from "@/mocks/data/banners.data";

export function HeroBanners({ banners }: { banners: Banner[] }) {
  const [primary, ...secondary] = banners;
  if (!primary) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <BannerCard banner={primary} className="lg:col-span-2" priority />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {secondary.slice(0, 2).map((banner) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
      </div>
    </div>
  );
}

function BannerCard({
  banner,
  className,
  priority,
}: {
  banner: Banner;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative flex min-h-56 flex-col justify-end overflow-hidden rounded-xl ${className ?? ""}`}>
      <Image
        src={banner.imageUrl}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="relative flex flex-col items-start gap-2 p-5 text-white sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl">{banner.title}</h2>
        <p className="max-w-sm text-sm text-white/90">{banner.subtitle}</p>
        <Button size="sm" className="mt-1" render={<Link href={banner.ctaHref} />} nativeButton={false}>
          {banner.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
