import type { Category } from "@/types/category.types";
import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";

export const CATEGORIES: Category[] = getOrCreateGlobalSingleton("categories", () => [
  {
    id: "cat-track-suits",
    slug: "track-suits",
    name: "Track Suits",
    description:
      "Full-zip and pullover track suits built for warm-ups, training, and everyday wear.",
    imageUrl: "https://picsum.photos/seed/cat-track-suits/800/600",
    parentId: null,
  },
  {
    id: "cat-jerseys-tshirts",
    slug: "jerseys-tshirts",
    name: "Jerseys & T-Shirts",
    description: "Breathable performance tees and team jerseys for training and match day.",
    imageUrl: "https://picsum.photos/seed/cat-jerseys/800/600",
    parentId: null,
  },
  {
    id: "cat-shorts-bottoms",
    slug: "shorts-bottoms",
    name: "Shorts & Bottoms",
    description: "Running shorts, joggers, and compression tights for every sport.",
    imageUrl: "https://picsum.photos/seed/cat-shorts/800/600",
    parentId: null,
  },
  {
    id: "cat-socks",
    slug: "socks",
    name: "Socks",
    description: "Cushioned, moisture-wicking socks for running, football, and the gym.",
    imageUrl: "https://picsum.photos/seed/cat-socks/800/600",
    parentId: null,
  },
  {
    id: "cat-footwear",
    slug: "footwear",
    name: "Footwear",
    description: "Running shoes, football boots, and training sneakers.",
    imageUrl: "https://picsum.photos/seed/cat-footwear/800/600",
    parentId: null,
  },
  {
    id: "cat-equipment",
    slug: "equipment",
    name: "Sports Equipment",
    description: "Balls, rackets, gym accessories, and training gear.",
    imageUrl: "https://picsum.photos/seed/cat-equipment/800/600",
    parentId: null,
  },
  {
    id: "cat-kids-sportswear",
    slug: "kids-sportswear",
    name: "Kids Sportswear",
    description: "Track suits, jerseys, and footwear sized for young athletes.",
    imageUrl: "https://picsum.photos/seed/cat-kids/800/600",
    parentId: null,
  },
]);
