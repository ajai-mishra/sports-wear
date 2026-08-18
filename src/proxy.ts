import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifySessionToken } from "@/lib/auth/session";
import {
  ADMIN_LOGIN_ROUTE,
  ADMIN_ROUTE_PREFIX,
  AUTH_GATED_ROUTE_PREFIXES,
  LOGIN_ROUTE,
  SESSION_COOKIE_NAME,
} from "@/lib/constants";
import { STAFF_ROLES } from "@/types/auth.types";

function buildContentSecurityPolicy(nonce: string): string {
  // React dev mode uses eval() for debugging/fast-refresh — only relax
  // script-src for it outside production.
  const scriptSrc =
    process.env.NODE_ENV === "production"
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`;

  return [
    `default-src 'self'`,
    scriptSrc,
    // No nonce here deliberately: nonces only attach to <style> tags, never to
    // style="..." attributes, and per the CSP spec a directive's 'unsafe-inline'
    // is dropped entirely once a nonce/hash appears in that same directive —
    // combining them silently blocks every inline style React/Base UI set for
    // positioning (popovers, tooltips, dropdowns), which is exactly what happened
    // here. Inline style injection is a much lower-severity vector than inline
    // script injection, so plain 'unsafe-inline' is the right tradeoff.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://picsum.photos https://fastly.picsum.photos`,
    `font-src 'self' data:`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");
}

function withSecurityHeaders(
  response: NextResponse,
  nonce: string,
): NextResponse {
  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy(nonce));
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self)",
  );
  return response;
}

function redirectWithReturnUrl(
  request: NextRequest,
  loginRoute: string,
): NextResponse {
  const loginUrl = new URL(loginRoute, request.url);
  loginUrl.searchParams.set(
    "returnUrl",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest): NextResponse {
  const nonce = randomBytes(16).toString("base64");
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(sessionToken);

  const isAuthGatedRoute = AUTH_GATED_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (isAuthGatedRoute && !session) {
    return withSecurityHeaders(redirectWithReturnUrl(request, LOGIN_ROUTE), nonce);
  }

  const isAdminLoginRoute = pathname.startsWith(ADMIN_LOGIN_ROUTE);
  const isAdminRoute =
    pathname.startsWith(ADMIN_ROUTE_PREFIX) && !isAdminLoginRoute;
  if (isAdminRoute) {
    const isStaff = session && STAFF_ROLES.includes(session.role);
    if (!isStaff) {
      return withSecurityHeaders(
        redirectWithReturnUrl(request, ADMIN_LOGIN_ROUTE),
        nonce,
      );
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return withSecurityHeaders(response, nonce);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
