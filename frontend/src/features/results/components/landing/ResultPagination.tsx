import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import type { ThemeClassesTypes } from "../../types";

type Props = {
  handlePageChange: (page: number) => void;
  current_page: number;
  isPreDisabled: boolean;
  isNextDisabled: boolean;
  classes: ThemeClassesTypes;
  total_pages: number;
};

/**
 * Modern pagination component with smart page number truncation
 *
 * Features:
 * - Smart truncation: Only shows ~7 page numbers regardless of total pages
 * - First/Last buttons for quick navigation
 * - Works with 1 page or 1,000,000 pages
 * - Google/GitHub style ellipsis for large page counts
 *
 * Algorithm: Shows [First] [Prev] [1] ... [current-1] [current] [current+1] ... [Last] [Next] [Last]
 */
export function ResultPagination({
  handlePageChange,
  current_page,
  isPreDisabled,
  isNextDisabled,
  classes,
  total_pages,
}: Props) {
  /**
   * Generates smart page numbers with ellipsis
   * Example outputs:
   * - 5 pages: [1, 2, 3, 4, 5]
   * - 100 pages, current=1: [1, 2, 3, ..., 100]
   * - 100 pages, current=50: [1, ..., 48, 49, 50, 51, 52, ..., 100]
   * - 100 pages, current=100: [1, ..., 98, 99, 100]
   */
  const getPageNumbers = (): (number | string)[] => {
    const delta = 2; // Pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let lastPage: number | undefined;

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (let i = current_page - delta; i <= current_page + delta; i++) {
      if (i > 1 && i < total_pages) {
        range.push(i);
      }
    }

    // Always include last page (if more than 1 page exists)
    if (total_pages > 1) {
      range.push(total_pages);
    }

    // Build final array with ellipsis
    range.forEach((page) => {
      if (lastPage) {
        if (page - lastPage === 2) {
          // Gap of 1 page: just show that page
          rangeWithDots.push(lastPage + 1);
        } else if (page - lastPage > 2) {
          // Gap of 2+ pages: show ellipsis
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(page);
      lastPage = page;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  // Determine if we're on dark or light theme based on classes
  const isDark = classes.pagination?.includes("slate");

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {/* First Page Button */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={isPreDisabled}
        className={`${classes.pagination} transition-all`}
        title="First page"
        aria-label="Go to first page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(current_page - 1)}
        disabled={isPreDisabled}
        className={`${classes.pagination} transition-all`}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers with Smart Truncation */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <div
              key={`ellipsis-${index}`}
              className={`w-10 h-10 flex items-center justify-center ${
                isDark ? "text-slate-500" : "text-gray-400"
              }`}
              aria-hidden="true"
            >
              <MoreHorizontal className="w-5 h-5" />
            </div>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === current_page;

        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-10 h-10 rounded-lg transition-all font-medium ${
              isActive ? classes.paginationActive : classes.pagination
            }`}
            aria-label={`Go to page ${pageNum}`}
            aria-current={isActive ? "page" : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(current_page + 1)}
        disabled={isNextDisabled}
        className={`${classes.pagination} transition-all`}
        aria-label="Go to next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => handlePageChange(total_pages)}
        disabled={isNextDisabled}
        className={`${classes.pagination} transition-all`}
        title="Last page"
        aria-label="Go to last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}
