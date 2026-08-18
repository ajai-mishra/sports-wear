import { NextResponse } from "next/server";

import { listActiveDiscounts } from "@/services/discount.service";

export async function GET() {
  return NextResponse.json(listActiveDiscounts());
}
