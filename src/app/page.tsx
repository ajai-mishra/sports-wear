import { HeroBanners } from "@/components/home/hero-banners";
import { TrustBadges } from "@/components/home/trust-badges";
import { CategoryCard } from "@/components/product/category-card";
import { ProductGrid } from "@/components/product/product-grid";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeading } from "@/components/shared/section-heading";
import { listActiveBanners } from "@/services/banner.service";
import { listCategories } from "@/services/category.service";
import { listFeaturedProducts } from "@/services/product.service";

export default function HomePage() {
  const banners = listActiveBanners();
  const categories = listCategories();
  const featuredProducts = listFeaturedProducts(8);

  return (
    <PageContainer className="flex flex-col gap-12 py-8 sm:gap-16 sm:py-10">
      <HeroBanners banners={banners} />

      <TrustBadges />

      <section className="flex flex-col gap-4">
        <SectionHeading title="Shop by Category" description="Everything you need, sorted by sport and style." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading
          title="Featured Products"
          description="Handpicked gear our athletes love."
          viewAllHref="/search"
        />
        <ProductGrid products={featuredProducts} />
      </section>
    </PageContainer>
  );
}
