import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/results/")({
  component: ResultsLanding,
});
import { useState } from "react";
import {
  ChevronRight,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Search,
  Zap,
  Moon,
  Sun,
} from "lucide-react";

const MOCK_RESULTS = Array.from({ length: 12 }, (_, i) => ({
  session_id: `session-${i + 1}`,
  completed_at: new Date(Date.now() - i * 86400000).toISOString(),
  scaled_score: Math.floor(Math.random() * 600 + 200),
  percentage: Math.floor(Math.random() * 100),
  passed: Math.random() > 0.4,
  performance_level: ["Excellent", "Very Good", "Pass", "Below Passing"][
    Math.floor(Math.random() * 4)
  ],
  total_time_spent: Math.floor(Math.random() * 14400),
  average_time_per_question: Math.floor(Math.random() * 120),
  correct_answers: Math.floor(Math.random() * 225),
  total_questions: 225,
}));

export default function ResultsLanding() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(true);
  const itemsPerPage = 6;

  const filteredResults = MOCK_RESULTS.filter((result) =>
    result.session_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getScoreColor = (score) => {
    if (isDark) {
      if (score >= 600) return "from-emerald-500 to-teal-500";
      if (score >= 500) return "from-blue-500 to-cyan-500";
      if (score >= 400) return "from-amber-500 to-orange-500";
      return "from-rose-500 to-red-500";
    } else {
      if (score >= 600)
        return {
          bg: "from-emerald-400 to-teal-400",
          border: "border-emerald-200",
          text: "text-emerald-700",
        };
      if (score >= 500)
        return {
          bg: "from-indigo-400 to-purple-400",
          border: "border-indigo-200",
          text: "text-indigo-700",
        };
      if (score >= 400)
        return {
          bg: "from-amber-400 to-orange-400",
          border: "border-amber-200",
          text: "text-amber-700",
        };
      return {
        bg: "from-rose-400 to-pink-400",
        border: "border-rose-200",
        text: "text-rose-700",
      };
    }
  };

  const getPerformanceBadge = (level) => {
    if (isDark) {
      const styles = {
        Excellent: "bg-emerald-100 text-emerald-700",
        "Very Good": "bg-blue-100 text-blue-700",
        Pass: "bg-amber-100 text-amber-700",
        "Below Passing": "bg-rose-100 text-rose-700",
      };
      return styles[level] || "bg-gray-100 text-gray-700";
    } else {
      const styles = {
        Excellent: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        "Very Good": "bg-indigo-100 text-indigo-700 border border-indigo-200",
        Pass: "bg-amber-100 text-amber-700 border border-amber-200",
        "Below Passing": "bg-rose-100 text-rose-700 border border-rose-200",
      };
      return (
        styles[level] || "bg-gray-100 text-gray-700 border border-gray-200"
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const darkClasses = {
    container:
      "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    header: "max-w-7xl mx-auto mb-12",
    title: "text-4xl md:text-5xl font-bold text-white mb-2",
    subtitle: "text-slate-400 text-lg",
    searchInput:
      "w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
    card: "group relative bg-slate-700/40 backdrop-blur border border-slate-600/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10",
    cardLabel: "text-slate-400 text-sm mb-1",
    cardValue: "text-white",
    cardMeta: "border-t border-slate-600/50",
    pagination:
      "px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600",
    paginationActive: "bg-blue-500 text-white",
  };

  const lightClasses = {
    container:
      "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50",
    header: "max-w-7xl mx-auto mb-12",
    title:
      "text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3",
    subtitle: "text-gray-600 text-lg max-w-2xl",
    searchInput:
      "w-full pl-12 pr-4 py-3 bg-white border border-indigo-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent shadow-sm",
    card: "group relative bg-white rounded-xl border border-indigo-100 p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300",
    cardLabel: "text-gray-500 text-xs font-semibold uppercase tracking-wide",
    cardValue: "text-gray-900",
    cardMeta: "border-t border-indigo-100",
    pagination:
      "px-4 py-2 rounded-lg bg-white border border-indigo-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300",
    paginationActive:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md",
  };

  const classes = isDark ? darkClasses : lightClasses;

  return (
    <div className={`${classes.container} px-6 md:px-12 py-12`}>
      {/* Header with Theme Toggle */}
      <div className={classes.header}>
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            {!isDark && (
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                  Your Progress
                </span>
              </div>
            )}
            <h1 className={classes.title}>
              {isDark ? "Your Exam Results" : "Exam Results"}
            </h1>
            <p className={classes.subtitle}>
              {isDark
                ? "Track your performance and identify areas for improvement"
                : "Track your performance, analyze your strengths, and identify areas for improvement across all your exam attempts."}
            </p>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`ml-4 p-2.5 rounded-lg transition-all ${
              isDark
                ? "bg-slate-700/50 border border-slate-600 text-yellow-400 hover:bg-slate-600"
                : "bg-gray-100 border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className={`absolute left-3 top-3 w-5 h-5 ${
              isDark ? "text-slate-500" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            placeholder="Search by session ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={classes.searchInput}
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto">
        {paginatedResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedResults.map((result) => {
              const colors = isDark
                ? getScoreColor(result.scaled_score)
                : getScoreColor(result.scaled_score);
              return (
                <a
                  key={result.session_id}
                  href={`/results/${result.session_id}`}
                  className={`${classes.card} cursor-pointer overflow-hidden`}
                >
                  {!isDark && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  )}

                  {isDark && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${colors} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />
                  )}

                  {/* Content */}
                  <div className="relative space-y-4">
                    {/* Score Section */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p
                          className={`${classes.cardLabel} ${
                            isDark ? "mb-1" : "mb-2"
                          }`}
                        >
                          Scaled Score
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-${
                              isDark ? "4xl" : "5xl"
                            } font-bold ${
                              isDark
                                ? `bg-gradient-to-r ${colors} bg-clip-text text-transparent`
                                : `bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`
                            }`}
                          >
                            {result.scaled_score}
                          </span>
                          <span
                            className={`${
                              isDark ? "text-slate-500" : "text-gray-400"
                            } text-sm font-medium`}
                          >
                            /800
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-${
                          isDark ? "full" : "lg"
                        } text-xs font-semibold ${getPerformanceBadge(
                          result.performance_level
                        )}`}
                      >
                        {result.performance_level}
                      </div>
                    </div>

                    {!isDark && (
                      <div className="pt-2">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
                            style={{
                              width: `${(result.scaled_score / 800) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stats Row */}
                    <div
                      className={`flex items-center justify-between pt-4 ${classes.cardMeta}`}
                    >
                      <div>
                        <p
                          className={`${classes.cardLabel} ${
                            isDark ? "mb-0" : "mb-1"
                          }`}
                        >
                          Accuracy
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            isDark
                              ? "text-white"
                              : "text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                          }`}
                        >
                          {result.percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p
                          className={`${classes.cardLabel} ${
                            isDark ? "mb-0" : "mb-1"
                          }`}
                        >
                          {isDark ? "Status" : "Correct"}
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            isDark
                              ? result.passed
                                ? "text-emerald-400"
                                : "text-rose-400"
                              : "text-gray-900"
                          }`}
                        >
                          {isDark
                            ? result.passed
                              ? "✓ Passed"
                              : "✗ Failed"
                            : `${result.correct_answers}/${result.total_questions}`}
                        </p>
                      </div>
                      {!isDark && (
                        <div className="text-right">
                          <p className={classes.cardLabel}>Result</p>
                          <p
                            className={`text-lg font-bold ${
                              result.passed
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            {result.passed ? "✓ Pass" : "✗ Fail"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div
                      className={`grid grid-cols-2 gap-3 pt-4 ${classes.cardMeta}`}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          !isDark
                            ? "p-2.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors"
                            : ""
                        }`}
                      >
                        <Calendar
                          className={`w-4 h-4 ${
                            isDark ? "text-slate-500" : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <p
                            className={`${
                              isDark
                                ? "text-slate-500 text-xs"
                                : "text-gray-500 text-xs font-medium"
                            }`}
                          >
                            Date
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isDark
                                ? "text-white"
                                : "font-semibold text-gray-900"
                            }`}
                          >
                            {formatDate(result.completed_at)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          !isDark
                            ? "p-2.5 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors"
                            : ""
                        }`}
                      >
                        <Clock
                          className={`w-4 h-4 ${
                            isDark ? "text-slate-500" : "text-purple-600"
                          }`}
                        />
                        <div>
                          <p
                            className={`${
                              isDark
                                ? "text-slate-500 text-xs"
                                : "text-gray-500 text-xs font-medium"
                            }`}
                          >
                            Time
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isDark
                                ? "text-white"
                                : "font-semibold text-gray-900"
                            }`}
                          >
                            {formatTime(result.total_time_spent)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          !isDark
                            ? "p-2.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors"
                            : ""
                        }`}
                      >
                        <Award
                          className={`w-4 h-4 ${
                            isDark ? "text-slate-500" : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <p
                            className={`${
                              isDark
                                ? "text-slate-500 text-xs"
                                : "text-gray-500 text-xs font-medium"
                            }`}
                          >
                            {isDark ? "Correct" : "Questions"}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isDark
                                ? "text-white"
                                : "font-semibold text-gray-900"
                            }`}
                          >
                            {isDark
                              ? `${result.correct_answers}/${result.total_questions}`
                              : result.total_questions}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          !isDark
                            ? "p-2.5 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors"
                            : ""
                        }`}
                      >
                        <TrendingUp
                          className={`w-4 h-4 ${
                            isDark ? "text-slate-500" : "text-purple-600"
                          }`}
                        />
                        <div>
                          <p
                            className={`${
                              isDark
                                ? "text-slate-500 text-xs"
                                : "text-gray-500 text-xs font-medium"
                            }`}
                          >
                            Avg/Q
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              isDark
                                ? "text-white"
                                : "font-semibold text-gray-900"
                            }`}
                          >
                            {result.average_time_per_question}s
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div
                      className={`flex items-center justify-between pt-4 ${
                        classes.cardMeta
                      } ${
                        isDark
                          ? "group-hover:text-blue-400"
                          : "group-hover:text-indigo-600"
                      } transition-colors`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-slate-400" : "text-gray-600"
                        }`}
                      >
                        {isDark ? "View Details" : "View Full Report"}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isDark ? "text-slate-500" : "text-gray-400"
                        } group-hover:translate-x-1 transition-transform`}
                      />
                    </div>
                  </div>
                </a>
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
              No results found
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`${classes.pagination} transition-all`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg transition-all font-medium ${
                  page === currentPage
                    ? classes.paginationActive
                    : classes.pagination
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`${classes.pagination} transition-all`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
