import type { GradientColorScheme } from "../types";

export const getPercentageColor = (
  percentage: number,
  isDark: boolean
): GradientColorScheme => {
  if (isDark) {
    if (percentage >= 80)
      return {
        gradient: "from-emerald-500 to-teal-500",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
      };
    if (percentage >= 60)
      return {
        gradient: "from-blue-500 to-cyan-500",
        border: "border-blue-500/30",
        text: "text-blue-400",
      };
    if (percentage >= 40)
      return {
        gradient: "from-amber-500 to-orange-500",
        border: "border-amber-500/30",
        text: "text-amber-400",
      };
    return {
      gradient: "from-rose-500 to-red-500",
      border: "border-rose-500/30",
      text: "text-rose-400",
    };
  } else {
    if (percentage >= 80)
      return {
        gradient: "from-emerald-400 to-teal-400",
        border: "border-emerald-200",
        text: "text-emerald-700",
      };
    if (percentage >= 60)
      return {
        gradient: "from-indigo-400 to-purple-400",
        border: "border-indigo-200",
        text: "text-indigo-700",
      };
    if (percentage >= 40)
      return {
        gradient: "from-amber-400 to-orange-400",
        border: "border-amber-200",
        text: "text-amber-700",
      };
    return {
      gradient: "from-rose-400 to-pink-400",
      border: "border-rose-200",
      text: "text-rose-700",
    };
  }
};

export const getScoreColor = (
  score: number,
  isDark: boolean
): GradientColorScheme => {
  if (isDark) {
    if (score >= 600)
      return {
        gradient: "from-emerald-500 to-teal-500",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
      };
    if (score >= 500)
      return {
        gradient: "from-blue-500 to-cyan-500",
        border: "border-blue-500/30",
        text: "text-blue-400",
      };
    if (score >= 400)
      return {
        gradient: "from-amber-500 to-orange-500",
        border: "border-amber-500/30",
        text: "text-amber-400",
      };
    return {
      gradient: "from-rose-500 to-red-500",
      border: "border-rose-500/30",
      text: "text-rose-400",
    };
  } else {
    if (score >= 600)
      return {
        gradient: "from-emerald-400 to-teal-400",
        border: "border-emerald-200",
        text: "text-emerald-700",
      };
    if (score >= 500)
      return {
        gradient: "from-indigo-400 to-purple-400",
        border: "border-indigo-200",
        text: "text-indigo-700",
      };
    if (score >= 400)
      return {
        gradient: "from-amber-400 to-orange-400",
        border: "border-amber-200",
        text: "text-amber-700",
      };
    return {
      gradient: "from-rose-400 to-pink-400",
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
