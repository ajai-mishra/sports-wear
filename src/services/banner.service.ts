import { BANNERS, type Banner } from "@/mocks/data/banners.data";

export function listActiveBanners(): Banner[] {
  return BANNERS.filter((banner) => banner.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function listAllBanners(): Banner[] {
  return BANNERS;
}

export function createBanner(input: Omit<Banner, "id">): Banner {
  const banner: Banner = { ...input, id: `banner-${Date.now()}` };
  BANNERS.push(banner);
  return banner;
}

export function updateBanner(bannerId: string, updates: Partial<Omit<Banner, "id">>): Banner | null {
  const banner = BANNERS.find((candidate) => candidate.id === bannerId);
  if (!banner) return null;
  Object.assign(banner, updates);
  return banner;
}

export function deleteBanner(bannerId: string): boolean {
  const index = BANNERS.findIndex((banner) => banner.id === bannerId);
  if (index === -1) return false;
  BANNERS.splice(index, 1);
  return true;
}
