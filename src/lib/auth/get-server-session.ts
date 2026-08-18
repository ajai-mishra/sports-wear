import { cookies } from "next/headers";

import { verifySessionToken } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import type { SessionPayload } from "@/types/auth.types";

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
