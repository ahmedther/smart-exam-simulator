import { queryOptions } from "@tanstack/react-query";
import { examApi } from "../../../api/examApi";
import { useState } from "react";
import type { PaginatedResultsTypes, ResultsSearchTypes } from "../types";

const resultsQueryOptions = (params: ResultsSearchTypes) =>
  queryOptions<PaginatedResultsTypes>({
    queryKey: ["results", params.page, params.search, params.sort],
    queryFn: () => examApi.fetchAllResults(params),
  });

export { resultsQueryOptions };

export const useAllResults = () => {
  const [isDark, setIsDark] = useState(true);

  // Helper functions
  const getScoreColor = (score: number) => {
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

  const getPerformanceBadge = (level: string) => {
    if (isDark) {
      const styles: Record<string, string> = {
        Excellent: "bg-emerald-100 text-emerald-700",
        "Very Good": "bg-blue-100 text-blue-700",
        Pass: "bg-amber-100 text-amber-700",
        "Below Passing": "bg-rose-100 text-rose-700",
        "Supervised Practice Level": "bg-orange-100 text-orange-700",
      };
      return styles[level] || "bg-gray-100 text-gray-700";
    } else {
      const styles: Record<string, string> = {
        Excellent: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        "Very Good": "bg-indigo-100 text-indigo-700 border border-indigo-200",
        Pass: "bg-amber-100 text-amber-700 border border-amber-200",
        "Below Passing": "bg-rose-100 text-rose-700 border border-rose-200",
        "Supervised Practice Level":
          "bg-orange-100 text-orange-700 border border-orange-200",
      };
      return (
        styles[level] || "bg-gray-100 text-gray-700 border border-gray-200"
      );
    }
  };

  const darkClasses = {
    container:
      "min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900",
    header: "max-w-7xl mx-auto mb-12",
    title:
      "text-5xl md:text-6xl font-bold bg-linear-to-r from-white via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3",
    subtitle: "text-slate-400 text-lg max-w-2xl",
    searchInput:
      "w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
    card: "group relative bg-slate-700/40 backdrop-blur border border-slate-600/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10",
    cardLabel: "text-slate-400 text-xs font-semibold uppercase tracking-wide",
    cardValue: "text-white",
    cardMeta: "border-t border-slate-600/50",
    pagination:
      "px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600",
    paginationActive: "bg-blue-500 text-white",
    icon: "w-6 h-6 text-white",
    iconText: "text-white",
  };

  const lightClasses = {
    container:
      "min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50",
    header: "max-w-7xl mx-auto mb-12",
    title:
      "text-5xl md:text-6xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3",
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
      "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md",
    icon: "w-6 h-6 text-indigo-600",
    iconText: "text-indigo-600",
  };

  const classes = isDark ? darkClasses : lightClasses;

  return {
    isDark,
    setIsDark,
    getScoreColor,
    getPerformanceBadge,
    classes,
  };
};
