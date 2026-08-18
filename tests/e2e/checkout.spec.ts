import { expect, test } from "@playwright/test";

const CART_STORAGE_KEY = "sw_cart";

/**
 * Seeds the guest cart with one real product variant (fetched live from the
 * mock /api/products endpoints, so variantId/price/stock always match what
 * /api/checkout will re-derive server-side) and signs in as the demo
 * customer, mirroring the persisted shape zustand's `persist` middleware
 * writes to localStorage: {state: {items: [...]}, version: 0}.
 */
async function loginAndSeedCart(page: import("@playwright/test").Page) {
  const loginResponse = await page.request.post("/api/auth/login", {
    data: { email: "customer@example.com", password: "Password123!" },
  });
  expect(loginResponse.ok()).toBe(true);

  const productsResponse = await page.request.get("/api/products");
  expect(productsResponse.ok()).toBe(true);
  const productsBody = await productsResponse.json();
  const firstProductSummary = productsBody.data[0];

  const productDetailResponse = await page.request.get(`/api/products/${firstProductSummary.slug}`);
  expect(productDetailResponse.ok()).toBe(true);
  const productDetailBody = await productDetailResponse.json();
  const product = productDetailBody.product;
  const variant = product.variants[0];

  const cartLineItem = {
    variantId: variant.id,
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    brand: product.brand,
    imageUrl: product.images[0]?.url ?? "",
    size: variant.size,
    color: variant.color,
    unitPrice: variant.price,
    compareAtPrice: variant.compareAtPrice,
    quantity: 1,
    stockQuantity: variant.stockQuantity,
  };

  await page.addInitScript(
    ({ storageKey, item }) => {
      window.localStorage.setItem(storageKey, JSON.stringify({ state: { items: [item] }, version: 0 }));
    },
    { storageKey: CART_STORAGE_KEY, item: cartLineItem },
  );
}

test.describe("Cart page", () => {
  test("should show the seeded item and its subtotal", async ({ page }) => {
    await loginAndSeedCart(page);
    await page.goto("/cart");

    await expect(page.getByRole("heading", { name: /Your Cart \(1\)/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Proceed to Checkout" })).toBeVisible();
  });
});

test.describe("Checkout flow", () => {
  test("should complete address, delivery, and payment steps and reach the confirmation page", async ({
    page,
  }) => {
    await loginAndSeedCart(page);

    await page.goto("/cart");
    await page.getByRole("button", { name: "Proceed to Checkout" }).click();
    await expect(page).toHaveURL(/\/checkout\/address/);

    await page.getByLabel("Full name").fill("Test User");
    await page.getByLabel("Phone").fill("9999999999");
    await page.getByLabel("Address line 1").fill("1 Test Street");
    await page.getByLabel("City").fill("Bengaluru");
    await page.getByLabel("State").fill("Karnataka");
    await page.getByLabel("Postal code").fill("560001");
    await page.getByLabel("Country").fill("India");
    await page.getByRole("button", { name: "Continue to Delivery" }).click();

    await expect(page).toHaveURL(/\/checkout\/delivery/);
    await page.getByText(/Express \(1.2 business days\)/).click();
    await page.getByRole("button", { name: "Continue to Payment" }).click();

    await expect(page).toHaveURL(/\/checkout\/payment/);
    await page.getByText("UPI", { exact: true }).click();
    await page.getByRole("button", { name: "Place Order" }).click();

    await expect(page).toHaveURL(/\/checkout\/confirmation\/.+/, { timeout: 15_000 });
    await expect(page.getByText("Thank you for your order!")).toBeVisible();
    await expect(page.getByText(/Order ID/)).toBeVisible();
  });

  test("should redirect /checkout/delivery back to /checkout/address when no address has been set", async ({
    page,
  }) => {
    await loginAndSeedCart(page);
    await page.goto("/checkout/delivery");
    await expect(page).toHaveURL(/\/checkout\/address$/);
  });

  test("should redirect /checkout/payment back to /checkout/address when no address has been set", async ({
    page,
  }) => {
    await loginAndSeedCart(page);
    await page.goto("/checkout/payment");
    await expect(page).toHaveURL(/\/checkout\/address$/);
  });
});
