import { expect, type Page, test } from "@playwright/test";

/**
 * A logged-out visitor's session check (GET /api/auth/me) is expected to 401 on
 * every page — the app handles it gracefully (useSession returns null), but
 * Chromium still logs the failed network request as a console error regardless.
 * Likewise, deliberately navigating to a nonexistent route legitimately produces
 * a 404 response for the navigation itself even though the app renders a friendly
 * not-found page for it.
 */
function collectUnexpectedConsoleErrors(page: Page): string[] {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.text().includes("401")) return;
    if (message.text().includes("404")) return;
    consoleErrors.push(message.text());
  });
  return consoleErrors;
}

const STATIC_PAGES = [
  { path: "/about", heading: "About Sports Wear" },
  { path: "/contact", heading: "Contact Us" },
  { path: "/faq", heading: "Frequently Asked Questions" },
  { path: "/legal/terms", heading: "Terms of Service" },
  { path: "/legal/privacy", heading: "Privacy Policy" },
  { path: "/legal/shipping-returns", heading: "Shipping & Returns" },
] as const;

test.describe("Static content pages", () => {
  for (const { path, heading } of STATIC_PAGES) {
    test(`should render the ${path} page with no console errors`, async ({ page }) => {
      const consoleErrors = collectUnexpectedConsoleErrors(page);

      await page.goto(path);

      await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe("Global 404 page", () => {
  test("should show a friendly not-found page for an unmatched route", async ({ page }) => {
    const consoleErrors = collectUnexpectedConsoleErrors(page);

    await page.goto("/this-page-does-not-exist");

    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    // Rendered via Button render={<Link .../>} nativeButton={false}, which Base UI
    // gives role="button" (not "link") to preserve button semantics — see
    // src/app/not-found.tsx and the same pattern in src/app/offline/page.tsx.
    await expect(page.getByRole("button", { name: "Back to home" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Search products" })).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Contact form", () => {
  test("should show a success toast and reset the form when submitted", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel("Name").fill("Asha Rao");
    await page.getByLabel("Email").fill("asha.rao@example.com");
    await page.getByLabel("Message").fill("Hi, I have a question about sizing for track suits.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(
      page.getByText("Message sent — we'll get back to you within 1 business day."),
    ).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveValue("");
    await expect(page.getByLabel("Message")).toHaveValue("");
  });

  test("should show validation errors when submitted empty", async ({ page }) => {
    await page.goto("/contact");

    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Message must be at least 10 characters.")).toBeVisible();
  });
});
