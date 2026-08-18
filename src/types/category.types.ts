export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  parentId: string | null;
}
