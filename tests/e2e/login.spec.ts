import { expect, test } from "@playwright/test";

test.describe("Login page", () => {
  test("should show a generic error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("customer@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.locator("form").getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Invalid email or password" })).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("should sign in with valid demo credentials and update the header", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("customer@example.com");
    await page.getByLabel("Password").fill("Password123!");
    await page.locator("form").getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole("button", { name: "Account menu" })).toBeVisible();
  });

  test("should honor returnUrl and land back on the originally-requested page", async ({ page }) => {
    await page.goto("/checkout/address");
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fcheckout%2Faddress/);

    await page.getByLabel("Email").fill("customer@example.com");
    await page.getByLabel("Password").fill("Password123!");
    await page.locator("form").getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/checkout\/address/);
  });
});
