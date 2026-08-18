import { expect, test } from "@playwright/test";

// Uses a serial describe block because both tests operate on the same freshly-created
// account: the reset-password flow must not touch the shared seeded `customer@example.com`
// account, since other specs running elsewhere rely on its password staying unchanged.
test.describe.serial("Signup, OTP verification, and password reset", () => {
  // Date.now() alone can collide: the chromium and mobile-chrome projects both load this
  // file at nearly the same instant, and two workers hitting the shared mock backend with
  // the identical "unique" email causes a real (and correct) 409 conflict on the second
  // signup. Each project runs in its own process, so process.pid keeps the value unique
  // per concurrently-running worker even when Date.now() collides.
  const uniqueEmail = `new-user-${Date.now()}-${process.pid}@example.com`;
  const initialPassword = "Password123!";
  const newPassword = "NewPassword456!";

  test("should sign up, verify with the mock OTP, and land signed in on /account", async ({ page }) => {
    await page.goto("/signup");

    await page.getByLabel("Full name").fill("New User");
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("Phone number").fill("9876543210");
    await page.getByLabel("Password").fill(initialPassword);
    await page.locator("form").getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(/\/verify-otp/);
    await expect(page.getByText(uniqueEmail)).toBeVisible();

    await page.getByLabel("Verification code").fill("123456");
    await page.locator("form").getByRole("button", { name: "Verify email" }).click();

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole("button", { name: "Account menu" })).toBeVisible();
  });

  test("should reset the password via forgot/reset and sign in with the new password", async ({ page }) => {
    await page.goto("/forgot-password");

    await page.getByLabel("Email").fill(uniqueEmail);
    await page.locator("form").getByRole("button", { name: "Send verification code" }).click();

    await expect(
      page.getByRole("alert").filter({ hasText: "verification code has been sent" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Continue to reset password" }).click();

    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.getByText(uniqueEmail)).toBeVisible();

    await page.getByLabel("Verification code").fill("123456");
    await page.getByLabel("New password", { exact: true }).fill(newPassword);
    await page.getByLabel("Confirm new password").fill(newPassword);
    await page.locator("form").getByRole("button", { name: "Reset password" }).click();

    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("Password").fill(newPassword);
    await page.locator("form").getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole("button", { name: "Account menu" })).toBeVisible();
  });
});
