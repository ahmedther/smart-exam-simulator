import { Award, XCircle, TrendingUp } from "lucide-react";
import type { ResultsStatsTypes } from "../../types";

type BaseProps = {
  isDark: boolean;
  startItem: number;
  endItem: number;
  totalResults: number;
};

type ResultsCountProps = BaseProps & {
  stats: ResultsStatsTypes;
};

/**
 * Modern results count component with statistics
 *
 * Visual hierarchy (top to bottom):
 * 1. Text summary - Quick understanding of range
 * 2. Statistics cards - Key metrics at a glance
 * 3. Progress bar - Visual progress indicator
 *
 * This order follows the F-pattern: users see the most important info first,
 * then dive into details, with visual reinforcement at the bottom.
 */
export function ResultsCount({
  isDark,
  startItem,
  endItem,
  totalResults,
  stats,
}: ResultsCountProps) {
  const percentage = (endItem / totalResults) * 100;

  return (
    <div className="space-y-6" role="region" aria-label="Results summary">
      {/* 1. TEXT SUMMARY - Most important info first */}
      <div
        className={`text-center ${isDark ? "text-slate-300" : "text-gray-700"}`}
        role="status"
        aria-live="polite"
      >
        <span
          className={`text-sm font-medium ${
            isDark ? "text-slate-400" : "text-gray-600"
          }`}
        >
          Showing{" "}
        </span>
        <span
          className={`font-bold text-xl ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {startItem.toLocaleString()}–{endItem.toLocaleString()}
        </span>
        <span
          className={`text-sm font-medium ${
            isDark ? "text-slate-400" : "text-gray-600"
          }`}
        >
          {" "}
          of{" "}
        </span>
        <span
          className={`font-bold text-xl ${
            isDark
              ? "bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              : "bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          }`}
        >
          {totalResults.toLocaleString()}
        </span>
        <span
          className={`text-sm font-medium ${
            isDark ? "text-slate-400" : "text-gray-600"
          }`}
        >
          {" "}
          results
        </span>
      </div>

      {/* 2. STATISTICS CARDS - Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        {/* Passed */}
        <div
          className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${
            isDark
              ? "bg-slate-800/50 hover:bg-slate-800"
              : "bg-emerald-50 hover:bg-emerald-100"
          }`}
        >
          <Award
            className={`w-6 h-6 mx-auto mb-2 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
            aria-hidden="true"
          />
          <div
            className={`text-xs font-medium mb-1 ${
              isDark ? "text-slate-400" : "text-emerald-700"
            }`}
          >
            Passed
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            {stats.passed.toLocaleString()}
          </div>
        </div>

        {/* Failed */}
        <div
          className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${
            isDark
              ? "bg-slate-800/50 hover:bg-slate-800"
              : "bg-rose-50 hover:bg-rose-100"
          }`}
        >
          <XCircle
            className={`w-6 h-6 mx-auto mb-2 ${
              isDark ? "text-rose-400" : "text-rose-600"
            }`}
            aria-hidden="true"
          />
          <div
            className={`text-xs font-medium mb-1 ${
              isDark ? "text-slate-400" : "text-rose-700"
            }`}
          >
            Failed
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-rose-400" : "text-rose-600"
            }`}
          >
            {stats.failed.toLocaleString()}
          </div>
        </div>

        {/* Pass Rate */}
        <div
          className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${
            isDark
              ? "bg-slate-800/50 hover:bg-slate-800"
              : "bg-indigo-50 hover:bg-indigo-100"
          }`}
        >
          <TrendingUp
            className={`w-6 h-6 mx-auto mb-2 ${
              isDark ? "text-blue-400" : "text-indigo-600"
            }`}
            aria-hidden="true"
          />
          <div
            className={`text-xs font-medium mb-1 ${
              isDark ? "text-slate-400" : "text-indigo-700"
            }`}
          >
            Pass Rate
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-blue-400" : "text-indigo-600"
            }`}
          >
            {stats.pass_rate}%
          </div>
        </div>
      </div>

      {/* 3. PROGRESS BAR - Visual reinforcement */}
      <div className="space-y-2">
        <div
          className={`flex items-center justify-between text-xs ${
            isDark ? "text-slate-500" : "text-gray-500"
          }`}
        >
          <span>Progress through results</span>
          <span className="font-medium">{percentage.toFixed(1)}% viewed</span>
        </div>
        <div
          className={`w-full h-2.5 rounded-full overflow-hidden ${
            isDark ? "bg-slate-700/50" : "bg-gray-200"
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isDark
                ? "bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"
                : "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
            }`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Viewing ${percentage.toFixed(1)}% of results`}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 *
 * <ResultsCount
 *   isDark={isDark}
 *   startItem={(currentPage - 1) * itemsPerPage + 1}
 *   endItem={Math.min(currentPage * itemsPerPage, totalCount)}
 *   totalResults={totalCount}
 *   currentPage={currentPage}
 *   totalPages={Math.ceil(totalCount / itemsPerPage)}
 *   stats={{
 *     passed: 156,
 *     failed: 91,
 *     totalExams: 247
 *   }}
 * />
 */
