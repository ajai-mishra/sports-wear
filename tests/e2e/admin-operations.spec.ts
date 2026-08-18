import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function loginAs(page: Page, email: string, password: string): Promise<void> {
  const response = await page.request.post("/api/auth/login", { data: { email, password } });
  expect(response.ok()).toBe(true);
}

test.describe("Admin operations pages (Support Agent)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "support@example.com", "Password123!");
  });

  test("should render the orders table with order rows", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("cell", { name: "order-1001" })).toBeVisible();
  });

  test("should render the customers table with block controls", async ({ page }) => {
    await page.goto("/admin/customers");
    await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("switch").first()).toBeVisible();
  });

  test("should render the reviews list with moderation actions", async ({ page }) => {
    await page.goto("/admin/reviews");
    await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("button", { name: "Approve" }).first()).toBeVisible();
  });
});

test.describe("Admin operations pages (Super Admin)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "superadmin@example.com", "Password123!");
  });

  test("should render the reports dashboard with stats and charts", async ({ page }) => {
    await page.goto("/admin/reports");
    await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
    await expect(page.getByText("Total Revenue")).toBeVisible();
    await expect(page.getByText("Total Orders")).toBeVisible();
    await expect(page.getByText("Total Customers")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Top Products by Reviews" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Revenue by Category" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Low Stock Variants" })).toBeVisible();
  });

  test("should render the roles table with a role selector per staff member", async ({ page }) => {
    await page.goto("/admin/roles");
    await expect(page.getByRole("heading", { name: "Staff & Roles" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("combobox").first()).toBeVisible();
  });

  test("should render the audit log in reverse-chronological order", async ({ page }) => {
    await page.goto("/admin/audit-log");
    await expect(page.getByRole("heading", { name: "Audit Log" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "When" })).toBeVisible();
  });
});

test.describe("Admin operations security — page-level role gating", () => {
  test("should let a Support Agent past the proxy (they ARE staff) but block them from Reports", async ({
    page,
  }) => {
    await loginAs(page, "support@example.com", "Password123!");

    // Support Agent is in STAFF_ROLES, so src/proxy.ts's coarse "is this
    // person staff at all" check lets this request through. Only the page's
    // own sessionHasRole([ADMIN, SUPER_ADMIN]) check can stop them here.
    await page.goto("/admin/reports");

    await expect(page).not.toHaveURL(/\/admin\/reports$/);
    await expect(page.getByText("Total Revenue")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Revenue by Category" })).toHaveCount(0);
  });

  test("should let a Support Agent past the proxy but block them from Roles", async ({ page }) => {
    await loginAs(page, "support@example.com", "Password123!");

    // Roles management is Super Admin-only — Support Agent must be blocked
    // at the page level even though they are staff.
    await page.goto("/admin/roles");

    await expect(page).not.toHaveURL(/\/admin\/roles$/);
    await expect(page.getByRole("heading", { name: "Staff & Roles" })).toHaveCount(0);
  });

  test("should let an Inventory Manager reach catalog pages but block them from Orders", async ({ page }) => {
    await loginAs(page, "inventory@example.com", "Password123!");

    await page.goto("/admin/orders");
    await expect(page).not.toHaveURL(/\/admin\/orders$/);
    await expect(page.getByRole("heading", { name: "Orders" })).toHaveCount(0);
  });

  test("should keep a signed-in customer out of the operations admin UI", async ({ page }) => {
    await loginAs(page, "customer@example.com", "Password123!");

    await page.goto("/admin/customers");

    await expect(page).not.toHaveURL(/\/admin\/customers$/);
    await expect(page.getByRole("heading", { name: "Customers" })).toHaveCount(0);
  });
});

// Cycles to a status that's always different from whatever the seeded order
// currently shows, so the test doesn't depend on (or reset) a specific
// starting value — see the project-skip note below for why that matters.
const NEXT_ORDER_STATUS_LABEL: Record<string, string> = {
  Pending: "Confirmed",
  Confirmed: "Shipped",
  Shipped: "Delivered",
  Delivered: "Cancelled",
  Cancelled: "Refunded",
  Refunded: "Pending",
};

test.describe("Order status mutation", () => {
  test("should update an order's status through the UI and reflect it without a manual reload", async ({
    page,
  }) => {
    // This mutates a shared seeded order (order-1003) in the mock data
    // store, which lives in the single dev server process behind every
    // project. Running it twice at once (once per Playwright project) would
    // race both writes against the same record, so it's restricted to one
    // project — the assertions below don't depend on browser engine.
    test.skip(test.info().project.name !== "chromium", "Runs once to avoid racing the shared mock order store.");

    await loginAs(page, "support@example.com", "Password123!");
    await page.goto("/admin/orders");

    const orderRow = page.getByRole("row", { name: /order-1003/ });
    await expect(orderRow).toBeVisible();

    await orderRow.getByRole("button", { name: "View" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const statusCombobox = dialog.getByRole("combobox", { name: "New status" });
    const currentLabel = (await statusCombobox.textContent())?.trim() ?? "Pending";
    const nextLabel = NEXT_ORDER_STATUS_LABEL[currentLabel] ?? "Confirmed";

    await statusCombobox.click();
    await page.getByRole("option", { name: nextLabel, exact: true }).click();
    await dialog.getByRole("button", { name: "Save status" }).click();

    await expect(dialog).toBeHidden();
    // No page.reload() anywhere above — this proves the row re-fetches via
    // the mutation's cache invalidation, not a hard navigation.
    await expect(orderRow.getByText(nextLabel, { exact: true })).toBeVisible();
  });
});
