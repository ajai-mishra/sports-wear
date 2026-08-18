import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("should render header, hero, category grid, featured products, and footer", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      // A logged-out visitor's session check (GET /api/auth/me) is expected to
      // 401 — the app handles it (useSession returns null), but Chromium still
      // logs the failed network request as a console error regardless.
      if (message.text().includes("401")) return;
      consoleErrors.push(message.text());
    });

    await page.goto("/");

    await expect(page.getByRole("banner").getByRole("link", { name: "Sports Wear" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shop by Category" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Featured Products" })).toBeVisible();
    await expect(page.getByText(/All rights reserved/)).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("should open the mobile menu on small viewports", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile nav trigger is only visible below the lg breakpoint");

    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
