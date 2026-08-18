import type { Category } from "@/types/category.types";
import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";
import { categoryImageUrl } from "@/mocks/data/image-url.util";

function categoryHeroImageUrl(categoryId: string): string {
  return categoryImageUrl(categoryId, 800, 600);
}

export const CATEGORIES: Category[] = getOrCreateGlobalSingleton("categories", () => [
  {
    id: "cat-track-suits",
    slug: "track-suits",
    name: "Track Suits",
    description:
      "Full-zip and pullover track suits built for warm-ups, training, and everyday wear.",
    imageUrl: categoryHeroImageUrl("cat-track-suits"),
    parentId: null,
  },
  {
    id: "cat-jerseys-tshirts",
    slug: "jerseys-tshirts",
    name: "Jerseys & T-Shirts",
    description: "Breathable performance tees and team jerseys for training and match day.",
    imageUrl: categoryHeroImageUrl("cat-jerseys-tshirts"),
    parentId: null,
  },
  {
    id: "cat-shorts-bottoms",
    slug: "shorts-bottoms",
    name: "Shorts & Bottoms",
    description: "Running shorts, joggers, and compression tights for every sport.",
    imageUrl: categoryHeroImageUrl("cat-shorts-bottoms"),
    parentId: null,
  },
  {
    id: "cat-socks",
    slug: "socks",
    name: "Socks",
    description: "Cushioned, moisture-wicking socks for running, football, and the gym.",
    imageUrl: categoryHeroImageUrl("cat-socks"),
    parentId: null,
  },
  {
    id: "cat-footwear",
    slug: "footwear",
    name: "Footwear",
    description: "Running shoes, football boots, and training sneakers.",
    imageUrl: categoryHeroImageUrl("cat-footwear"),
    parentId: null,
  },
  {
    id: "cat-equipment",
    slug: "equipment",
    name: "Sports Equipment",
    description: "Balls, rackets, gym accessories, and training gear.",
    imageUrl: categoryHeroImageUrl("cat-equipment"),
    parentId: null,
  },
  {
    id: "cat-kids-sportswear",
    slug: "kids-sportswear",
    name: "Kids Sportswear",
    description: "Track suits, jerseys, and footwear sized for young athletes.",
    imageUrl: categoryHeroImageUrl("cat-kids-sportswear"),
    parentId: null,
  },
]);
