import { NextResponse } from "next/server";

import { listCategories } from "@/services/category.service";

export async function GET() {
  return NextResponse.json(listCategories());
}
