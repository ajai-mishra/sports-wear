import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR";

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export function apiErrorResponse(code: ApiErrorCode, message: string): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status: STATUS_BY_CODE[code] });
}
