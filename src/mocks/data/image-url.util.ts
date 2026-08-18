// Category images sourced from Unsplash — hand-picked and visually verified to
// actually depict the category they represent. Random placeholder services
// (picsum.photos) serve completely unrelated stock photos, and keyword-based
// ones (loremflickr) were tried and rejected: compound keywords matched badly
// (a "sports-sale" query returned a photo of a cat) and, worse, its resizer
// pads lower-resolution source photos with a garish solid-color background and
// leaves the source's copyright watermark burned into the pixels.
const CATEGORY_IMAGE_PATH: Record<string, string> = {
  "cat-track-suits": "photo-1574338479188-8fb957471a6a",
  "cat-jerseys-tshirts": "flagged/photo-1580139736565-9f4bb2e7c900",
  "cat-shorts-bottoms": "photo-1554139844-af2fc8ad3a3a",
  "cat-socks": "photo-1640025867572-f6b3a8410c81",
  "cat-footwear": "photo-1615743472612-93b21e520fad",
  "cat-equipment": "photo-1576678927484-cc907957088c",
  "cat-kids-sportswear": "photo-1609422644211-a85c36ee36a7",
};

export function categoryImageUrl(categoryId: string, width: number, height: number): string {
  const path = CATEGORY_IMAGE_PATH[categoryId] ?? CATEGORY_IMAGE_PATH["cat-equipment"];
  return `https://images.unsplash.com/${path}?w=${width}&h=${height}&fit=crop&auto=format&q=75`;
}
