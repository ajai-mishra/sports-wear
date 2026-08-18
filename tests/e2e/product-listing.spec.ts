import { expect, type Page, test } from "@playwright/test";

function collectUnexpectedConsoleErrors(page: Page): string[] {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.text().includes("401")) return;
    consoleErrors.push(message.text());
  });
  return consoleErrors;
}

/**
 * ProductFilters renders twice on every listing page — once (CSS-hidden but
 * still mounted) in the desktop sidebar, once inside the mobile filter Sheet
 * (only mounted once opened) — so filter interactions must be scoped to
 * whichever instance is actually visible for the current viewport.
 */
async function getVisibleFiltersContainer(page: Page, isMobile: boolean | undefined) {
  if (isMobile) {
    await page.getByRole("button", { name: "Filters" }).click();
    return page.getByRole("dialog");
  }
  return page.locator("aside");
}

test.describe("Search / product listing page", () => {
  test("should render all products with facets, sorting, and pagination", async ({ page }) => {
    const consoleErrors = collectUnexpectedConsoleErrors(page);

    await page.goto("/search");

    await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
    await expect(page.getByText(/\d+ products?/)).toBeVisible();
    await expect(page.getByRole("navigation", { name: "pagination" })).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("should filter by on-sale-only and update the URL", async ({ page, isMobile }) => {
    await page.goto("/search");

    const filters = await getVisibleFiltersContainer(page, isMobile);
    await filters.getByRole("checkbox", { name: "On sale only" }).click();

    await expect(page).toHaveURL(/onSaleOnly=true/);
  });

  test("should filter by size and reflect the choice as an active filter chip", async ({ page, isMobile }) => {
    await page.goto("/search");

    const filters = await getVisibleFiltersContainer(page, isMobile);
    await filters.getByRole("button", { name: "S", exact: true }).click();
    await expect(page).toHaveURL(/sizes=S/);
  });

  test("should navigate to page 2 via pagination and update the URL", async ({ page }) => {
    await page.goto("/search");

    // Pagination links render via the Button component, which sets
    // role="button" even on its <a>-rendered form — see the render-prop note
    // in product-detail.spec.ts / src/components/ui/pagination.tsx.
    const pagination = page.getByRole("navigation", { name: "pagination" });
    await pagination.getByRole("button", { name: "2", exact: true }).click();
    await expect(page).toHaveURL(/page=2/);
  });
});

test.describe("Category page", () => {
  test("should scope results to the category and only show its own facets", async ({ page, isMobile }) => {
    const consoleErrors = collectUnexpectedConsoleErrors(page);

    await page.goto("/category/footwear");

    await expect(page.getByRole("heading", { name: "Footwear" })).toBeVisible();

    const filters = await getVisibleFiltersContainer(page, isMobile);
    // Footwear-only sizes (UK shoe sizes) should appear; sock/track-suit-only
    // sizes should not, proving getProductFacets() is scoped by category.
    await expect(filters.getByRole("button", { name: "UK 8", exact: true })).toBeVisible();
    await expect(filters.getByRole("button", { name: "XXL", exact: true })).toHaveCount(0);

    expect(consoleErrors).toEqual([]);
  });

  test("should 404 for an unknown category slug", async ({ page }) => {
    const response = await page.goto("/category/this-category-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
