import { expect, test } from "@playwright/test";

test.describe("Payment/account route gating", () => {
  test("should redirect an unauthenticated visitor away from /checkout/* with a returnUrl", async ({ page }) => {
    await page.goto("/checkout/address");
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fcheckout%2Faddress/);
  });

  test("should redirect an unauthenticated visitor away from /account with a returnUrl", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Faccount/);
  });

  test("should reject checkout API calls without a session, and accept them after login", async ({ page }) => {
    const unauthenticatedResponse = await page.request.post("/api/checkout", {
      data: {
        items: [{ variantId: "does-not-matter", quantity: 1 }],
        shippingAddress: {
          fullName: "Test User",
          phone: "9999999999",
          line1: "1 Test Street",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560001",
          country: "India",
        },
      },
    });
    expect(unauthenticatedResponse.status()).toBe(401);
    const unauthenticatedBody = await unauthenticatedResponse.json();
    expect(unauthenticatedBody.error.code).toBe("UNAUTHENTICATED");

    const loginResponse = await page.request.post("/api/auth/login", {
      data: { email: "customer@example.com", password: "Password123!" },
    });
    expect(loginResponse.ok()).toBe(true);

    // Now that the session cookie is set on this browser context, a
    // previously-gated page should render instead of redirecting to /login.
    await page.goto("/account");
    await expect(page).not.toHaveURL(/\/login/);
  });
});
