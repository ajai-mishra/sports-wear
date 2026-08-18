import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export const BANNERS: Banner[] = getOrCreateGlobalSingleton("banners", () => [
  {
    id: "banner-flash-sale",
    title: "End of Season Flash Sale",
    subtitle: "Up to 40% off track suits, footwear, and training gear.",
    ctaLabel: "Shop the sale",
    ctaHref: "/search?onSaleOnly=true",
    imageUrl: "https://picsum.photos/seed/banner-flash-sale/1600/700",
    isActive: true,
    sortOrder: 0,
  },
  {
    id: "banner-footwear",
    title: "Footwear Week",
    subtitle: "20% off running shoes, boots, and trainers for a limited time.",
    ctaLabel: "Explore footwear",
    ctaHref: "/category/footwear",
    imageUrl: "https://picsum.photos/seed/banner-footwear/1600/700",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "banner-kids",
    title: "Kids Sportswear",
    subtitle: "Gear up young athletes for the new season.",
    ctaLabel: "Shop kids",
    ctaHref: "/category/kids-sportswear",
    imageUrl: "https://picsum.photos/seed/banner-kids/1600/700",
    isActive: true,
    sortOrder: 2,
  },
]);
