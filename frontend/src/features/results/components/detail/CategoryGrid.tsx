import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import type { CategoryPerformance } from "../../types";
import { useState } from "react";
import { getPercentageColor } from "../../theme";

type CategoryGridProps = {
  isDark: boolean;
  cardClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  categoryPerformanceData: CategoryPerformance[];
};

export function CategoryGrid({
  cardClass,
  textPrimaryClass,
  textSecondaryClass,
  categoryPerformanceData,
  isDark,
}: CategoryGridProps) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  return (
    <div className={`${cardClass} mb-8`}>
      <h2
        className={`text-xl font-bold ${textPrimaryClass} mb-6 flex items-center gap-2`}
      >
        <BarChart3 className="w-5 h-5" />
        Category Performance
      </h2>
      <div className="space-y-3">
        {categoryPerformanceData.map(
          (cat: CategoryPerformance, idx: number) => {
            const bgClass = getPercentageColor(cat.accuracy, isDark);
            return (
              <div
                key={cat.category_id}
                onClick={() =>
                  setExpandedCategory(expandedCategory === idx ? null : idx)
                }
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  isDark
                    ? "bg-slate-600/30 hover:bg-slate-600/50 border border-slate-600/30"
                    : "bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-semibold ${textPrimaryClass}`}>
                    {cat.name}
                  </p>
                  <p className={`text-lg font-bold ${textPrimaryClass}`}>
                    {cat.accuracy.toFixed(0)}%
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full bg-linear-to-r ${bgClass.gradient}`}
                    style={{ width: `${cat.accuracy}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${textSecondaryClass}`}>
                    {cat.correct}/{cat.correct + cat.incorrect + cat.skipped}{" "}
                    correct
                  </p>
                  {expandedCategory === idx ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>

                {expandedCategory === idx && (
                  <div
                    className={`mt-4 pt-4 border-t ${
                      isDark ? "border-slate-600/30" : "border-indigo-200"
                    }`}
                  >
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div>
                        <p className={textSecondaryClass}>✓ Correct</p>
                        <p className="text-emerald-400 font-semibold">
                          {cat.correct}
                        </p>
                      </div>
                      <div>
                        <p className={textSecondaryClass}>✗ Incorrect</p>
                        <p className="text-rose-400 font-semibold">
                          {cat.incorrect}
                        </p>
                      </div>
                      <div>
                        <p className={textSecondaryClass}>⊘ Skipped</p>
                        <p className="text-amber-400 font-semibold">
                          {cat.skipped}
                        </p>
                      </div>
                      <div>
                        <p className={textSecondaryClass}>⏱ Time</p>
                        <p className="text-blue-400 font-semibold">
                          {cat.total_time}s
                        </p>
                      </div>
                      <div>
                        <p className={textSecondaryClass}>⏱ Avg/Q</p>
                        <p className="text-blue-400 font-semibold">
                          {cat.avg_time_per_question}s
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
