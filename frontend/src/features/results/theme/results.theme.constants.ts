// src/features/results/constants/results.theme.constants.ts

export const DARK_THEME_CLASSES = {
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
  textPrimary: "text-white",
  textSecondary: "text-slate-400",
};

export const LIGHT_THEME_CLASSES = {
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
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
};
