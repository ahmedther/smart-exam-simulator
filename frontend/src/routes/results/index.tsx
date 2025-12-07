import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useResultsTheme } from "../../features/results/hooks";
import {
  ResultPagination,
  ResultsHeader,
  ResultsSearch,
} from "../../features/results/components";
import type { ResultsSearchTypes } from "../../features/results/types";
import ResultCard from "../../features/results/components/landing/ResultCard";
import { ResultsCount } from "../../features/results/components/landing/ResultsCount";
import {
  getPerformanceBadge,
  getScoreColor,
} from "../../features/results/theme";
import { resultsQueryOptions } from "../../features/results/config/resultQuery.config";

export const Route = createFileRoute("/results/")({
  component: ResultsLanding,
  validateSearch: (search: Record<string, unknown>): ResultsSearchTypes => {
    // Ensure we ALWAYS return a valid object
    return {
      page: search?.page ? Number(search.page) : 1,
      search: typeof search?.search === "string" ? search.search : "",
      sort: typeof search?.sort === "string" ? search.sort : "-date",
    };
  },
  loaderDeps: ({ search }) => search, // Add this line!
  loader: async ({ context: { queryClient }, deps }) => {
    console.log("Loader deps:", deps);

    return queryClient.ensureQueryData(
      resultsQueryOptions({
        page: deps.page,
        search: deps.search,
        sort: deps.sort,
      })
    );
  },
});

export default function ResultsLanding() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(resultsQueryOptions(search));

  // Use the custom hook for UI logic
  const { isDark, toggleTheme, classes } = useResultsTheme();

  // Navigation handlers
  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  const handleSortChange = (newSort: string) => {
    navigate({
      search: (prev) => ({ ...prev, sort: newSort, page: 1 }),
    });
  };

  return (
    <div className={`${classes.container} px-6 md:px-12 py-12`}>
      {/* Header with Theme Toggle */}
      <div className={classes.header}>
        <ResultsHeader
          classes={classes}
          isDark={isDark}
          setIsDark={toggleTheme}
        />
        {/* Search & Sort */}
        <ResultsSearch
          search={search}
          classes={classes}
          handleSortChange={handleSortChange}
        />
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto">
        {data.results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {data.results.map((result) => {
              const colors = getScoreColor(result.scaled_score, isDark);
              return (
                <ResultCard
                  key={result.session_id}
                  result={result}
                  classes={classes}
                  isDark={isDark}
                  colors={colors}
                  performanceBadge={(level: string) =>
                    getPerformanceBadge(level, isDark)
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p
              className={
                isDark ? "text-slate-400 text-lg" : "text-gray-500 text-lg"
              }
            >
              No results found for "{search.search}"
            </p>
          </div>
        )}

        {/* Pagination */}
        {data.total_pages > 1 && (
          <ResultPagination
            handlePageChange={handlePageChange}
            current_page={data.current_page}
            isPreDisabled={!data.has_previous}
            isNextDisabled={!data.has_next}
            classes={classes}
            totalPages={data.total_pages}
          />
        )}

        {/* Results Count */}
        <div className="text-center mt-6">
          <ResultsCount
            isDark={isDark}
            startItem={(data.current_page - 1) * data.page_size + 1}
            endItem={Math.min(data.current_page * data.page_size, data.count)}
            totalResults={data.count}
            stats={data.stats}
          />
        </div>
      </div>
    </div>
  );
}
