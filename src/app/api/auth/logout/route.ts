import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/auth/cookie.util";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
