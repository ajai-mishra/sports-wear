import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function loginAs(page: Page, email: string, password: string): Promise<void> {
  const response = await page.request.post("/api/auth/login", { data: { email, password } });
  expect(response.ok()).toBe(true);
}

test.describe("Admin catalog pages (Inventory Manager)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "inventory@example.com", "Password123!");
  });

  test("should render the dashboard with role-appropriate content", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
    await expect(page.getByText("Total Variants")).toBeVisible();
    await expect(page.getByText("At/Below Reorder Threshold")).toBeVisible();
  });

  test("should render the products table with a New Product action", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.getByRole("button", { name: "New Product" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should render the inventory table with stock columns", async ({ page }) => {
    await page.goto("/admin/inventory");
    await expect(page.getByRole("heading", { name: "Inventory" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Stock" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Adjust stock" }).first()).toBeVisible();
  });

  test("should render the categories table and create a category without a manual reload", async ({ page }) => {
    await page.goto("/admin/categories");
    await expect(page.getByRole("heading", { name: "Categories" })).toBeVisible();

    const uniqueName = `E2E Test Category ${Date.now()}`;
    await page.getByRole("button", { name: "New Category" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Name").fill(uniqueName);
    await dialog.getByLabel("Slug").fill(`e2e-test-category-${Date.now()}`);
    await dialog.getByLabel("Description").fill("Created by the admin-catalog e2e test.");
    await dialog.getByLabel("Image URL").fill("https://picsum.photos/seed/e2e-category/400/300");
    await dialog.getByRole("button", { name: "Create category" }).click();

    await expect(dialog).toBeHidden();
    // No page.reload() anywhere above — this proves the list re-fetches via
    // the mutation's cache invalidation, not a hard navigation.
    await expect(page.getByRole("cell", { name: uniqueName, exact: true })).toBeVisible();
  });
});

test.describe("Admin catalog security — page-level role gating", () => {
  test("should keep a signed-in customer out of the product management UI", async ({ page }) => {
    await loginAs(page, "customer@example.com", "Password123!");

    await page.goto("/admin/products");

    // The coarse proxy check (STAFF_ROLES) already stops a plain customer
    // before the page ever renders, so this is defense-in-depth: whichever
    // layer caught it, the admin product management UI must never appear.
    await expect(page.getByRole("button", { name: "New Product" })).toHaveCount(0);
    await expect(page).not.toHaveURL(/\/admin\/products$/);
  });

  test("should let a Support Agent past the proxy (they ARE staff) but block them at the page level", async ({
    page,
  }) => {
    await loginAs(page, "support@example.com", "Password123!");

    // Support Agent is in STAFF_ROLES, so src/proxy.ts's coarse "is this
    // person staff at all" check lets this request through. Only the
    // page's own sessionHasRole([INVENTORY_MANAGER, ADMIN, SUPER_ADMIN])
    // check can stop them here — this is the scenario the page-level
    // guard exists for.
    await page.goto("/admin/products");

    await expect(page).not.toHaveURL(/\/admin\/products$/);
    await expect(page.getByRole("button", { name: "New Product" })).toHaveCount(0);
  });

  test("should let a Marketing Manager reach discounts but not products", async ({ page }) => {
    await loginAs(page, "marketing@example.com", "Password123!");

    await page.goto("/admin/discounts");
    await expect(page.getByRole("heading", { name: "Discounts" })).toBeVisible();

    await page.goto("/admin/products");
    await expect(page).not.toHaveURL(/\/admin\/products$/);
    await expect(page.getByRole("button", { name: "New Product" })).toHaveCount(0);
  });
});
