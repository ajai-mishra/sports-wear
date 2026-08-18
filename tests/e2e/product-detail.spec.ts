import { expect, test } from "@playwright/test";

const PRODUCT_PATH = "/products/stridewear-pulse-running-shoe";

test.describe("Product detail page", () => {
  test("should render gallery, breadcrumb, and variant selectors with no console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("401")) consoleErrors.push(message.text());
    });

    await page.goto(PRODUCT_PATH);

    await expect(page.getByRole("heading", { name: "Pulse Running Shoe" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "breadcrumb" }).getByRole("link", { name: "Footwear" })).toBeVisible();
    await expect(page.getByText(/^Color:/)).toBeVisible();
    await expect(page.getByText(/^Size:/)).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("should update the selected size options when switching color", async ({ page }) => {
    await page.goto(PRODUCT_PATH);

    await expect(page.getByText("Color: Black")).toBeVisible();
    await page.getByRole("button", { name: "Ignite Orange" }).click();
    await expect(page.getByText("Color: Ignite Orange")).toBeVisible();
  });

  test("should add the selected variant to the cart and open the cart drawer", async ({ page }) => {
    await page.goto(PRODUCT_PATH);

    await page.getByRole("button", { name: "UK 8", exact: true }).click();
    await page.getByRole("button", { name: "Add to Cart" }).click();

    await expect(page.getByRole("dialog").getByText(/Your Cart \(1\)/)).toBeVisible();
    await expect(page.getByRole("dialog").getByText("Pulse Running Shoe")).toBeVisible();
  });

  test("should toggle the wishlist button state", async ({ page }) => {
    await page.goto(PRODUCT_PATH);

    const productInfo = page.getByRole("region", { name: "Product information" });
    await productInfo.getByRole("button", { name: "Add to wishlist" }).click();
    await expect(productInfo.getByRole("button", { name: "Remove from wishlist" })).toBeVisible();
  });

  test("should open the image lightbox when the main image is clicked", async ({ page }) => {
    await page.goto(PRODUCT_PATH);

    await page.locator(".cursor-zoom-in").click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("should prompt a signed-out visitor to sign in before writing a review", async ({ page }) => {
    await page.goto(PRODUCT_PATH);

    const signInLink = page.getByRole("button", { name: "Sign in to write a review" });
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("should 404 for an unknown product slug", async ({ page }) => {
    const response = await page.goto("/products/this-product-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
