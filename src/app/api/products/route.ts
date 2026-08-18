import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { parseProductFilters } from "@/lib/parse-product-filters";
import { listProducts } from "@/services/product.service";

export async function GET(request: NextRequest) {
  const filters = parseProductFilters(request.nextUrl.searchParams);
  const result = listProducts(filters);
  return NextResponse.json(result);
}
