import Image from "next/image";
import Link from "next/link";

import type { Category } from "@/types/category.types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-lg"
    >
      <Image
        src={category.imageUrl}
        alt={category.name}
        fill
        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="relative p-3 text-sm font-semibold text-white">{category.name}</span>
    </Link>
  );
}
