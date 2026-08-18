# Sports Wear — Frontend

Next.js 16 (App Router) storefront and admin panel for the Sports Wear e-commerce platform. This is the **frontend-only build phase**: every "API" call hits local Next.js Route Handlers backed by in-memory mock data (`src/mocks/data/`) shaped exactly like the future NestJS API responses, so swapping in the real backend later is a config change, not a rewrite (see [Connecting the real backend later](#connecting-the-real-backend-later)).

See [`../DESIGN.md`](../DESIGN.md) at the repo root for the full product/architecture design doc.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling / components | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Client state | Zustand (cart, wishlist, UI state) |
| Server state / data fetching | TanStack Query |
| Forms & validation | react-hook-form + zod |
| Auth (mock stage) | Signed, httpOnly session cookie (`src/lib/auth/session.ts`) |
| Testing | Vitest + React Testing Library (unit), Playwright (E2E/smoke) |
| Package manager | pnpm |

## Prerequisites

- **Node.js ≥ 20.9** (Next.js 16 requirement). This project was built and is pinned to **Node 24** via `.nvmrc`.
- **pnpm** (via [Corepack](https://nodejs.org/api/corepack.html), bundled with Node): `corepack enable && corepack prepare pnpm@latest --activate`

If you use [nvm](https://github.com/nvm-sh/nvm), running any command from this directory will pick up the pinned version automatically once you run:

```bash
nvm install   # installs the version in .nvmrc if you don't already have it
nvm use
```

## Running locally

```bash
# 1. Install dependencies
pnpm install

# 2. (Optional) create a .env.local — see Environment variables below
cp .env.example .env.local   # if you've created one; otherwise defaults are fine for local dev

# 3. Start the dev server (Turbopack, hot reload)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The header, storefront, auth flow, account pages, and `/admin` panel are all live against the mock API.

### Demo accounts (mock auth)

Sign in at `/login` (customers) or `/admin/login` (staff) with any of these — password for all of them is `Password123!`:

| Role | Email |
|---|---|
| Customer | `customer@example.com` |
| Inventory Manager | `inventory@example.com` |
| Marketing Manager | `marketing@example.com` |
| Support Agent | `support@example.com` |
| Admin | `admin@example.com` |
| Super Admin | `superadmin@example.com` |

Signup / forgot-password OTP verification accepts the fixed mock code **`123456`** (see `MOCK_OTP_CODE` in `src/lib/constants.ts`) — no real email/SMS is sent at this stage.

> Mock data lives only in server memory. Anything created or changed through the admin panel (products, stock, discounts, orders, etc.) resets when the dev server restarts.

## Available scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the dev server with hot reload (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve a completed production build (`pnpm build` first) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | End-to-end/smoke tests (Playwright), run against `pnpm dev` |
| `pnpm test:e2e:prod` | Same E2E suite, run against a real production build (`pnpm build && pnpm start`). Requires `SESSION_SECRET` to be set in your shell first — production mode refuses to boot without it. Dev mode always renders every route dynamically, so this is the only way to catch bugs that only occur under static prerendering (e.g. a CSP nonce baked into a statically-generated page going stale — see the comment in `playwright.prod.config.ts`). Run this before any release that touches `src/app/layout.tsx`, `src/proxy.ts`, or route-level `dynamic`/`revalidate` exports. |

Run `pnpm lint && pnpm typecheck && pnpm test` before opening a PR.

## Environment variables

None are required for local development — sensible defaults apply. For production, set:

| Variable | Required in prod? | Purpose |
|---|---|---|
| `SESSION_SECRET` | **Yes** | HMAC secret signing the mock session cookie. The app throws on startup in production if this is unset (`src/lib/auth/session.ts`). Generate one with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_API_BASE_URL` | No (defaults to `/api`) | Base URL the browser's API client (`src/lib/api-client.ts`) calls. Leave unset while running against the mock API; point it at the real backend once it exists (see below). |

## Building for production

```bash
pnpm build   # compiles and type-checks; fails the build on type errors
pnpm start   # serves the build from step above on :3000 (set PORT to change)
```

Before deploying:
1. Set `SESSION_SECRET` in the hosting environment (required — the app refuses to boot without it in production).
2. Serve over HTTPS. The session cookie is marked `Secure` automatically when `NODE_ENV=production`, so it will not be sent over plain HTTP.
3. Remember the catalog/orders/users are in-memory mock data — every deploy (and every server restart/scale-out event) resets them. This is expected at this stage and goes away once the real backend is wired up.

### Deploying

Any Node hosting platform that runs `pnpm build && pnpm start` works (Vercel, Render, Fly.io, a plain VM/container). No special adapter is needed — this is a standard Next.js App Router app.

## Connecting the real backend later

The frontend never imports mock data directly from components — everything flows through:

```
Client Components  →  TanStack Query hooks (src/hooks/)  →  apiClient (src/lib/api-client.ts)  →  fetch(`${NEXT_PUBLIC_API_BASE_URL}/...`)
Server Components  →  service layer (src/services/*.service.ts) directly (no network hop)
```

To switch the browser-side API calls to the real NestJS backend, set `NEXT_PUBLIC_API_BASE_URL` to its URL — no component or hook code changes. Server Components currently call `src/services/*.service.ts` directly for performance; once a real backend exists, those call sites swap to `fetch(process.env.API_BASE_URL + ...)` against the same response shapes the mock routes already return (the mock routes were written to mirror the planned NestJS REST API in [`../DESIGN.md`](../DESIGN.md)).

The payment/checkout gate (`src/proxy.ts` + `src/app/api/checkout/route.ts`) already enforces "no payment without a valid session" server-side, independent of the UI redirect — that check carries over unchanged; only the session-verification mechanism swaps from the mock HMAC cookie to a real JWT.

## Project structure

```
src/
  app/                 Routes (App Router), incl. app/api/** mock Route Handlers
  components/          Reusable UI: ui/ (shadcn primitives), layout/, product/, cart/, shared/, home/
  hooks/               TanStack Query hooks (client-side data fetching/mutations)
  lib/                 api-client, auth/session, validation schemas, constants, utils
  mocks/data/          In-memory mock datasets (server-only)
  services/            Domain logic operating on mock data — the layer Route Handlers call
  store/               Zustand stores (cart, wishlist, UI state)
  types/                Shared domain types/enums
  proxy.ts             Route-gating + per-request CSP nonce (Next 16's middleware replacement)
```
