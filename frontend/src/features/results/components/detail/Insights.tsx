import { Zap } from "lucide-react";
import type { Insight } from "../../types";

type Props = {
  isDark: boolean;
  insights: Insight[];
  cardClass: string;
  textPrimaryClass: string;
};

export function Insights({
  isDark,
  insights,
  cardClass,
  textPrimaryClass,
}: Props) {
  const getSeverityColor = (severity: string, isDark: boolean): string => {
    if (isDark) {
      // Dark theme: Deep slate surfaces with vibrant neon-like accents
      // Matches the slate-900/800/700 palette with glowing colored borders
      const colors: Record<string, string> = {
        critical: "bg-rose-500/20 border-rose-400/40 text-rose-300",
        high: "bg-orange-500/20 border-orange-400/40 text-orange-300",
        medium: "bg-violet-500/20 border-violet-400/40 text-violet-300",
        low: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
      };
      return colors[severity] || colors.low;
    } else {
      // Light theme: Soft pastel containers matching indigo-50/purple-50 aesthetic
      // Subtle borders with rich text colors for contrast
      const colors: Record<string, string> = {
        critical: "bg-rose-50 border-rose-200 text-rose-700",
        high: "bg-orange-50 border-orange-200 text-orange-700",
        medium: "bg-purple-50 border-purple-200 text-purple-700",
        low: "bg-emerald-50 border-emerald-200 text-emerald-700",
      };
      return colors[severity] || colors.low;
    }
  };

  return (
    <div className={`${cardClass} mb-8`}>
      <h2
        className={`text-xl font-bold ${textPrimaryClass} mb-4 flex items-center gap-2`}
      >
        <Zap className="w-5 h-5" />
        Insights & Recommendations
      </h2>
      <div className="space-y-3">
        {insights.map((insight: Insight, idx: number) => {
          const color = getSeverityColor(insight.severity, isDark);
          return (
            <div key={idx} className={`p-4 border rounded-lg ${color}`}>
              <p className="font-semibold">{insight.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
