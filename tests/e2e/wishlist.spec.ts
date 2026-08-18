import { expect, test } from "@playwright/test";

const PRODUCT_PATH = "/products/stridewear-pulse-running-shoe";

test.describe("Wishlist", () => {
  test("should show an empty state when nothing has been saved", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(page.getByText("Your wishlist is empty")).toBeVisible();
  });

  test("should add a product from the PDP, reach it via the header button, and remove it", async ({ page }) => {
    await page.goto(PRODUCT_PATH);

    const productInfo = page.getByRole("region", { name: "Product information" });
    await productInfo.getByRole("button", { name: "Add to wishlist" }).click();
    await expect(productInfo.getByRole("button", { name: "Remove from wishlist" })).toBeVisible();

    await page.getByRole("button", { name: /Open wishlist, 1 items?/ }).click();
    await expect(page).toHaveURL("/wishlist");
    await expect(page.getByRole("heading", { name: "Your Wishlist (1)" })).toBeVisible();
    await expect(page.getByText("Pulse Running Shoe")).toBeVisible();

    await page.getByRole("button", { name: /Remove .* from wishlist/ }).click();
    await expect(page.getByText("Your wishlist is empty")).toBeVisible();
  });
});
