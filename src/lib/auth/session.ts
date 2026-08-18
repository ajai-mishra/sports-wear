import { createHmac, timingSafeEqual } from "node:crypto";

import type { SessionPayload } from "@/types/auth.types";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/constants";

/**
 * Mock session signing for the frontend-only build phase.
 * The real NestJS backend will issue signed JWTs instead — this module
 * exists so route gating logic (proxy.ts, route handlers) already works
 * against a tamper-resistant token and needs no rewrite when the backend
 * lands, only a swap of `signSession`/`verifySessionToken` for JWT verify.
 */

const FALLBACK_DEV_SECRET = "sports-wear-mock-session-secret-do-not-use-in-prod";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET environment variable must be set in production.",
    );
  }

  return FALLBACK_DEV_SECRET;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function computeSignature(encodedPayload: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function signSession(
  payload: Omit<SessionPayload, "issuedAt" | "expiresAt">,
): string {
  const issuedAt = Date.now();
  const fullPayload: SessionPayload = {
    ...payload,
    issuedAt,
    expiresAt: issuedAt + SESSION_MAX_AGE_SECONDS * 1000,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = computeSignature(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined | null,
): SessionPayload | null {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = computeSignature(encodedPayload);
  const providedSignatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (providedSignatureBuffer.length !== expectedSignatureBuffer.length) {
    return null;
  }
  if (!timingSafeEqual(providedSignatureBuffer, expectedSignatureBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
