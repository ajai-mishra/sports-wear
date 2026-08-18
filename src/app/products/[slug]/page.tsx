import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfoPanel } from "@/components/product/product-info-panel";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductGrid } from "@/components/product/product-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeading } from "@/components/shared/section-heading";
import { getCategoryById } from "@/services/category.service";
import { getProductBySlug, listRelatedProducts } from "@/services/product.service";
import { listApprovedReviewsForProduct } from "@/services/review.service";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryById(product.categoryId);
  const relatedProducts = listRelatedProducts(product);
  const reviews = listApprovedReviewsForProduct(product.id);

  const activePrices = product.variants.filter((v) => v.isActive).map((v) => v.price);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((image) => image.url),
    aggregateRating:
      product.reviewCount > 0
        ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount }
        : undefined,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...activePrices),
      highPrice: Math.max(...activePrices),
      availability: product.variants.some((v) => v.isActive && v.stockQuantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <PageContainer className="flex flex-col gap-10 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={`/category/${category.slug}`} />}>
                  {category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfoPanel product={product} />
      </div>

      <Accordion defaultValue={["description"]} className="max-w-3xl">
        <AccordionItem value="description">
          <AccordionTrigger>Description</AccordionTrigger>
          <AccordionContent>{product.description}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="size-guide">
          <AccordionTrigger>Size Guide</AccordionTrigger>
          <AccordionContent>{product.sizeGuide}</AccordionContent>
        </AccordionItem>
      </Accordion>

      <ProductReviews productSlug={product.slug} reviews={reviews} />

      {relatedProducts.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeading title="You may also like" />
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </PageContainer>
  );
}
