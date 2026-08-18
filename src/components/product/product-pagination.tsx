import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

function buildHref(basePath: string, searchParams: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(sorted[i]);
  }
  return result;
}

export function ProductPagination({ currentPage, totalPages, basePath, searchParams }: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(basePath, searchParams, Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink href={buildHref(basePath, searchParams, page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={buildHref(basePath, searchParams, Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
