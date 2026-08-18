import { defineConfig } from "@playwright/test";

import baseConfig from "./playwright.config";

// Runs the exact same spec files against a real production build (`next build`
// + `next start`) instead of `next dev`. This exists because dev mode always
// renders every route dynamically, so it can never catch bugs that only occur
// under static prerendering — e.g. the CSP nonce baked into a statically
// generated page's <script> tags going stale against the fresh per-request
// nonce proxy.ts sets on the response header, which silently blocked every
// script on the homepage (and every other static page) in production while
// every dev-mode and curl-only check passed clean.
export default defineConfig({
  ...baseConfig,
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
