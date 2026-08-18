import { CATEGORIES } from "@/mocks/data/categories.data";
import type { Category } from "@/types/category.types";

export function listCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | null {
  return CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function getCategoryById(id: string): Category | null {
  return CATEGORIES.find((category) => category.id === id) ?? null;
}

export function createCategory(input: Omit<Category, "id">): Category {
  const category: Category = { ...input, id: `cat-${Date.now()}` };
  CATEGORIES.push(category);
  return category;
}

export function updateCategory(categoryId: string, updates: Partial<Omit<Category, "id">>): Category | null {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  Object.assign(category, updates);
  return category;
}

export function deleteCategory(categoryId: string): boolean {
  const index = CATEGORIES.findIndex((category) => category.id === categoryId);
  if (index === -1) return false;
  CATEGORIES.splice(index, 1);
  return true;
}
