import { expect, type Page, test } from "@playwright/test";

/**
 * A logged-out visitor's session check would 401, but every test here logs in
 * first, so no 401 noise is expected. Mirrors the filter helper in
 * static-pages.spec.ts in case other incidental noise shows up.
 */
function collectUnexpectedConsoleErrors(page: Page): string[] {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    consoleErrors.push(message.text());
  });
  return consoleErrors;
}

async function loginAsCustomer(page: Page): Promise<void> {
  const loginResponse = await page.request.post("/api/auth/login", {
    data: { email: "customer@example.com", password: "Password123!" },
  });
  expect(loginResponse.ok()).toBe(true);
}

// Seeded in src/mocks/data/orders.data.ts for user-customer-1 (customer@example.com).
const SEEDED_ORDER_ID = "order-1001";

const ACCOUNT_PAGES = [
  { path: "/account", heading: "Welcome back" },
  { path: "/account/orders", heading: "Orders" },
  { path: `/account/orders/${SEEDED_ORDER_ID}`, heading: `Order #${SEEDED_ORDER_ID}` },
  { path: "/account/addresses", heading: "Addresses" },
  { path: "/account/profile", heading: "Profile" },
  { path: "/account/notifications", heading: "Notifications" },
  { path: "/account/returns", heading: "Returns" },
] as const;

test.describe("Account pages render", () => {
  for (const { path, heading } of ACCOUNT_PAGES) {
    test(`should render ${path} with its key heading and no unexpected console errors`, async ({ page }) => {
      await loginAsCustomer(page);
      const consoleErrors = collectUnexpectedConsoleErrors(page);

      await page.goto(path);

      await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
      expect(consoleErrors).toEqual([]);
    });
  }

  test("should show a friendly not-found message for an order that doesn't exist", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/account/orders/does-not-exist");

    await expect(page.getByRole("heading", { name: "Order not found" })).toBeVisible();
  });
});

test.describe("Profile mutation", () => {
  test("should persist the new name after reload", async ({ page }) => {
    await loginAsCustomer(page);
    const updatedName = `E2E Test User ${Date.now()}`;

    await page.goto("/account/profile");
    await page.getByLabel("Full name").fill(updatedName);
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("Profile updated.")).toBeVisible();

    await page.reload();
    await expect(page.getByLabel("Full name")).toHaveValue(updatedName);
  });
});

test.describe("Address mutation", () => {
  test("should add a new address and show it in the list without a manual reload", async ({ page }) => {
    await loginAsCustomer(page);
    const uniqueLine1 = `E2E Test Street ${Date.now()}`;

    await page.goto("/account/addresses");
    await page.getByRole("button", { name: "Add address" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByLabel("Full name").fill("E2E Test Recipient");
    await page.getByLabel("Phone").fill("9876543210");
    await page.getByLabel("Address line 1").fill(uniqueLine1);
    await page.getByLabel("City").fill("Bengaluru");
    await page.getByLabel("State").fill("Karnataka");
    await page.getByLabel("Postal code").fill("560001");
    await page.getByLabel("Country").fill("India");
    await page.locator("form").getByRole("button", { name: "Add address" }).click();

    await expect(page.getByText("Address added.")).toBeVisible();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    // No page.reload() here — this only passes if the create mutation
    // correctly invalidates the addresses query and triggers a refetch.
    await expect(page.getByText(uniqueLine1)).toBeVisible();
  });
});
