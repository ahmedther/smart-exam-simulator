import {
  Calendar,
  ChevronRight,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import type { ExamResultTypes, ThemeClassesTypes } from "../../types";
import { calculateQuestionMargin } from "../../../../utils";

type ColorType =
  | string
  | {
      bg: string;
      border: string;
      text: string;
    };

type Props = {
  isDark: boolean;
  result: ExamResultTypes;
  classes: ThemeClassesTypes;
  colors: ColorType;
  getPerformanceBadge: (level: string) => string;
};

export default function ResultCard({
  result,
  classes,
  isDark,
  colors,
  getPerformanceBadge,
}: Props) {
  const gradientClass = typeof colors === "string" ? colors : colors.bg;

  const questionMargin = calculateQuestionMargin(result);
  const marginText =
    questionMargin >= 0 ? `+${questionMargin}` : `${questionMargin}`;

  return (
    <a
      href={`/results/${result.session_id}`}
      className={`${classes.card} cursor-pointer overflow-hidden`}
    >
      {/* Hover Effects */}
      {!isDark && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-600 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      )}

      {isDark && (
        <div
          className={`absolute inset-0 bg-linear-to-br ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />
      )}

      <div className="relative space-y-4">
        {/* Score Section */}
        <div className="flex items-start justify-between">
          <div>
            <p className={`${classes.cardLabel} mb-2`}>Scaled Score</p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-5xl font-bold bg-linear-to-r ${gradientClass} bg-clip-text text-transparent`}
              >
                {result.scaled_score}
              </span>
              <span
                className={`${
                  isDark ? "text-slate-400" : "text-gray-400"
                } text-sm font-medium`}
              >
                /800
              </span>
            </div>
          </div>
          <div
            className={`px-3 py-1 ${
              isDark ? "rounded-full" : "rounded-lg"
            } text-xs font-semibold ${getPerformanceBadge(
              result.performance_level
            )}`}
          >
            {result.performance_level}
          </div>
        </div>

        {/* Progress Bar - Both themes */}
        <div className="pt-2">
          <div
            className={`w-full h-2 ${
              isDark ? "bg-slate-600/50" : "bg-gray-100"
            } rounded-full overflow-hidden`}
          >
            <div
              className={`h-full bg-linear-to-r ${gradientClass} transition-all duration-500`}
              style={{
                width: `${(result.scaled_score / 800) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Stats Row - FIXED: Shows consistent layout in both themes */}
        <div
          className={`flex items-center justify-between pt-4 ${classes.cardMeta}`}
        >
          <div>
            <p className={`${classes.cardLabel} mb-1`}>Accuracy</p>
            <p
              className={`text-xl font-semibold ${
                isDark
                  ? "text-white"
                  : "bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              }`}
            >
              {result.accuracy.toFixed(1)}%
            </p>
          </div>

          {/* FIXED: Show "Correct" label in both themes */}
          <div>
            <p className={`${classes.cardLabel} mb-1`}>Correct</p>
            <p
              className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {result.questions_summary}
            </p>
          </div>

          {/* FIXED: Changed "Status" to "Result" in dark mode */}
          <div className="text-right">
            <p className={classes.cardLabel}>Result</p>
            <p
              className={`text-xl font-bold ${
                result.passed
                  ? isDark
                    ? "text-emerald-400"
                    : "text-emerald-600"
                  : isDark
                  ? "text-rose-400"
                  : "text-rose-600"
              }`}
            >
              {result.passed ? "✓ Passed" : "✗ Failed"}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className={`grid grid-cols-2 gap-3 pt-4 ${classes.cardMeta}`}>
          <div
            className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-800/50 group-hover:bg-slate-800"
                : "bg-indigo-50 group-hover:bg-indigo-100"
            }`}
          >
            <Calendar
              className={`w-4 h-4 ${
                isDark ? "text-slate-400" : "text-indigo-600"
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
                  isDark ? "text-white" : "font-semibold text-gray-900"
                }`}
              >
                {result.date}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-800/50 group-hover:bg-slate-800"
                : "bg-purple-50 group-hover:bg-purple-100"
            }`}
          >
            <Clock
              className={`w-4 h-4 ${
                isDark ? "text-slate-400" : "text-purple-600"
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
                Duration
              </p>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-white" : "font-semibold text-gray-900"
                }`}
              >
                {result.total_time}
              </p>
            </div>
          </div>

          {/* FIXED: Question margin instead of score margin */}
          <div
            className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-800/50 group-hover:bg-slate-800"
                : "bg-indigo-50 group-hover:bg-indigo-100"
            }`}
          >
            <Target
              className={`w-4 h-4 ${
                isDark ? "text-slate-400" : "text-indigo-600"
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
                vs Pass
              </p>
              <p
                className={`text-sm font-medium ${
                  questionMargin >= 0
                    ? isDark
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : isDark
                    ? "text-rose-400"
                    : "text-rose-600"
                } font-semibold`}
              >
                {marginText} Q
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-800/50 group-hover:bg-slate-800"
                : "bg-purple-50 group-hover:bg-purple-100"
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 ${
                isDark ? "text-slate-400" : "text-purple-600"
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
                  isDark ? "text-white" : "font-semibold text-gray-900"
                }`}
              >
                {result.average_time}s
              </p>
            </div>
          </div>
        </div>
        {/* CTA */}
        <div
          className={`flex items-center justify-between pt-4 ${
            classes.cardMeta
          } ${
            isDark ? "group-hover:text-blue-400" : "group-hover:text-indigo-600"
          } transition-colors`}
        >
          <span
            className={`text-sm font-medium ${
              isDark ? "text-slate-400" : "text-gray-600"
            }`}
          >
            View Full Report
          </span>
          <ChevronRight
            className={`w-4 h-4 ${
              isDark ? "text-slate-400" : "text-gray-400"
            } group-hover:translate-x-1 transition-transform`}
          />
        </div>
      </div>
    </a>
  );
}
