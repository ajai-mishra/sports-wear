import { NextResponse } from "next/server";

import { listActiveBanners } from "@/services/banner.service";

export async function GET() {
  return NextResponse.json(listActiveBanners());
}
