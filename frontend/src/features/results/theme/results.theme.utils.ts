// src/features/results/utils/results.theme.utils.ts

/**
 * Get gradient color classes based on score
 * Returns different color schemes for dark/light themes
 */
export const getScoreColor = (score: number, isDark: boolean) => {
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

/**
 * Get badge styling classes based on performance level
 */
export const getPerformanceBadge = (level: string, isDark: boolean) => {
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
    return styles[level] || "bg-gray-100 text-gray-700 border border-gray-200";
  }
};
