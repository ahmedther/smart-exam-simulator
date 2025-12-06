import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/results/$sessionId")({
  component: ResultReport,
});

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
  Zap,
  Moon,
  Sun,
} from "lucide-react";

const MOCK_DATA = {
  results: {
    scaled_score: 238,
    percentage: 9.1,
    passed: false,
    correct_answers: 1,
    total_questions: 11,
    average_time_per_question: 3,
  },
  report: {
    submission: {
      type: "manual",
      time_utilized: 15,
      time_available: 20,
      time_utilization_percent: 75,
    },
    answers: {
      total: 11,
      answered: 5,
      skipped: 6,
      correct: 1,
      incorrect: 4,
    },
    categories: [
      {
        name: "Growth and Lifespan Development",
        accuracy: 100,
        correct: 1,
        incorrect: 0,
        skipped: 0,
        total_time: 1,
      },
      {
        name: "Cognitive-Affective Bases of Behavior",
        accuracy: 0,
        correct: 0,
        incorrect: 1,
        skipped: 1,
        total_time: 1,
      },
      {
        name: "Social and Cultural Bases of Behavior",
        accuracy: 0,
        correct: 0,
        incorrect: 1,
        skipped: 0,
        total_time: 12,
      },
      {
        name: "Research Methods and Statistics",
        accuracy: 0,
        correct: 0,
        incorrect: 1,
        skipped: 0,
        total_time: 1,
      },
      {
        name: "Assessment and Diagnosis",
        accuracy: 0,
        correct: 0,
        incorrect: 0,
        skipped: 1,
        total_time: 0,
      },
      {
        name: "Biological Bases of Behavior",
        accuracy: 0,
        correct: 0,
        incorrect: 0,
        skipped: 2,
        total_time: 0,
      },
    ],
    questions: [
      {
        number: 1,
        category: "Social and Cultural Bases of Behavior",
        question:
          "The first, non-pathologizing model of homosexual identity formation is associated with which of the following individuals?",
        choices: {
          a: "Troiden",
          b: "Cass",
          c: "Sophie",
          d: "Hanley-Hackenbrunch",
        },
        user_answer: "d",
        correct_answer: "b",
        is_correct: false,
        explanation:
          "Vivienne Cass proposed a six-stage model of homosexual identity development.",
        time_spent: 12,
      },
      {
        number: 2,
        category: "Growth and Lifespan Development",
        question:
          "Severe maternal malnutrition during the third trimester is correlated with deficits in children.",
        choices: {
          a: "autonomic nervous system",
          b: "developing brain",
          c: "physical disabilities",
          d: "social causes",
        },
        user_answer: "b",
        correct_answer: "b",
        is_correct: true,
        explanation:
          "Severe prenatal malnutrition in the third trimester has the most negative effect on the developing brain.",
        time_spent: 1,
      },
    ],
    insights: [
      {
        type: "weak_categories",
        severity: "high",
        message: "Focus on: Assessment and Diagnosis, Biological Bases",
      },
      {
        type: "unanswered_questions",
        severity: "medium",
        message: "6 questions unanswered. Attempt all questions.",
      },
      {
        type: "time_pressure",
        severity: "high",
        message: "You ran out of time. Practice faster resolution.",
      },
      {
        type: "needs_study",
        severity: "critical",
        message: "Review core concepts before next attempt.",
      },
    ],
  },
};

export default function ResultReport() {
  const [isDark, setIsDark] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const { results, report } = MOCK_DATA;

  const bgClass = isDark
    ? "min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
    : "min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50";

  const cardClass = isDark
    ? "bg-slate-700/40 border border-slate-600/50 rounded-xl p-6"
    : "bg-white border border-indigo-100 rounded-xl p-6";

  const textPrimaryClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-slate-400" : "text-gray-600";

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return "from-emerald-500 to-teal-500";
    if (accuracy >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: isDark
        ? "bg-rose-500/20 border-rose-500/30 text-rose-300"
        : "bg-rose-100 border-rose-200 text-rose-700",
      high: isDark
        ? "bg-orange-500/20 border-orange-500/30 text-orange-300"
        : "bg-orange-100 border-orange-200 text-orange-700",
      medium: isDark
        ? "bg-amber-500/20 border-amber-500/30 text-amber-300"
        : "bg-amber-100 border-amber-200 text-amber-700",
      low: isDark
        ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
        : "bg-blue-100 border-blue-200 text-blue-700",
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className={`${bgClass} p-6 md:p-12`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-5xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Exam Report
            </h1>
            <p className={textSecondaryClass}>
              Detailed analysis of your performance
            </p>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2.5 rounded-lg transition-all ${
              isDark
                ? "bg-slate-700/50 border border-slate-600 text-yellow-400 hover:bg-slate-600"
                : "bg-gray-100 border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={cardClass}>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>Scaled Score</p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-bold bg-linear-to-r ${getAccuracyColor(
                  results.percentage
                )} bg-clip-text text-transparent`}
              >
                {results.scaled_score}
              </span>
              <span className={textSecondaryClass}>/800</span>
            </div>
          </div>

          <div className={cardClass}>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>Accuracy</p>
            <p className={`text-4xl font-bold ${textPrimaryClass}`}>
              {results.percentage.toFixed(1)}%
            </p>
          </div>

          <div className={cardClass}>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>Time Used</p>
            <p className={`text-4xl font-bold ${textPrimaryClass}`}>
              {report.submission.time_utilization_percent}%
            </p>
          </div>

          <div className={cardClass}>
            <p className={`text-sm ${textSecondaryClass} mb-2`}>Submission</p>
            <p className={`text-lg font-semibold ${textPrimaryClass}`}>
              {report.submission.type === "timeout" ? "⏱️ Auto" : "✋ Manual"}
            </p>
          </div>
        </div>

        {/* Answer Breakdown */}
        <div className={`${cardClass} mb-8`}>
          <h2 className={`text-xl font-bold ${textPrimaryClass} mb-4`}>
            Answer Breakdown
          </h2>
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center">
              <p className={`text-3xl font-bold ${textPrimaryClass}`}>
                {report.answers.total}
              </p>
              <p className={textSecondaryClass}>Total</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">
                {report.answers.correct}
              </p>
              <p className={textSecondaryClass}>Correct</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose-400">
                {report.answers.incorrect}
              </p>
              <p className={textSecondaryClass}>Incorrect</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">
                {report.answers.skipped}
              </p>
              <p className={textSecondaryClass}>Skipped</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {results.average_time_per_question}s
              </p>
              <p className={textSecondaryClass}>Avg/Q</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className={`${cardClass} mb-8`}>
          <h2
            className={`text-xl font-bold ${textPrimaryClass} mb-6 flex items-center gap-2`}
          >
            <BarChart3 className="w-5 h-5" />
            Category Performance
          </h2>
          <div className="space-y-3">
            {report.categories.map((cat, idx) => (
              <div
                key={idx}
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
                    className={`h-full bg-linear-to-r ${getAccuracyColor(
                      cat.accuracy
                    )}`}
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
                          {(
                            cat.total_time /
                            (cat.correct + cat.incorrect + cat.skipped)
                          ).toFixed(1)}
                          s
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className={`${cardClass} mb-8`}>
          <h2
            className={`text-xl font-bold ${textPrimaryClass} mb-4 flex items-center gap-2`}
          >
            <Zap className="w-5 h-5" />
            Insights & Recommendations
          </h2>
          <div className="space-y-3">
            {report.insights.map((insight, idx) => (
              <div
                key={idx}
                className={`p-4 border rounded-lg ${getSeverityColor(
                  insight.severity
                )}`}
              >
                <p className="font-semibold">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className={cardClass}>
          <h2 className={`text-xl font-bold ${textPrimaryClass} mb-6`}>
            Question Review
          </h2>
          <div className="space-y-4">
            {report.questions.map((q, idx) => (
              <div
                key={idx}
                onClick={() =>
                  setExpandedQuestion(expandedQuestion === idx ? null : idx)
                }
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  q.is_correct
                    ? isDark
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-emerald-50 border-emerald-200"
                    : q.is_correct === false
                    ? isDark
                      ? "bg-rose-500/10 border-rose-500/30"
                      : "bg-rose-50 border-rose-200"
                    : isDark
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-sm font-bold ${textSecondaryClass}`}
                      >
                        Q{q.number}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isDark ? "bg-slate-600/50" : "bg-gray-100"
                        }`}
                      >
                        {q.category}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          q.is_correct
                            ? "text-emerald-400"
                            : q.is_correct === false
                            ? "text-rose-400"
                            : "text-amber-400"
                        }`}
                      >
                        {q.is_correct
                          ? "✓ Correct"
                          : q.is_correct === false
                          ? "✗ Wrong"
                          : "⊘ Skipped"}
                      </span>
                    </div>
                    <p className={`font-semibold ${textPrimaryClass}`}>
                      {q.question.substring(0, 100)}...
                    </p>
                  </div>
                  {expandedQuestion === idx ? <ChevronUp /> : <ChevronDown />}
                </div>

                {expandedQuestion === idx && (
                  <div
                    className={`mt-4 pt-4 border-t ${
                      isDark ? "border-slate-600/30" : "border-indigo-200"
                    }`}
                  >
                    <div className="space-y-3">
                      <div>
                        <p
                          className={`text-sm font-semibold ${textSecondaryClass} mb-2`}
                        >
                          Question
                        </p>
                        <p className={textPrimaryClass}>{q.question}</p>
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${textSecondaryClass} mb-2`}
                        >
                          All Choices
                        </p>
                        <div className="space-y-2">
                          {Object.entries(q.choices).map(([key, value]) => (
                            <div
                              key={key}
                              className={`p-2 rounded border ${
                                key === q.user_answer
                                  ? q.is_correct
                                    ? "bg-emerald-500/20 border-emerald-500/50"
                                    : "bg-rose-500/20 border-rose-500/50"
                                  : key === q.correct_answer
                                  ? "bg-emerald-500/10 border-emerald-500/30"
                                  : isDark
                                  ? "bg-slate-600/20 border-slate-600/30"
                                  : "bg-gray-100 border-gray-200"
                              }`}
                            >
                              <p
                                className={`font-semibold ${textPrimaryClass}`}
                              >
                                <span className="font-bold">
                                  {key.toUpperCase()}.
                                </span>{" "}
                                {value}
                                {key === q.user_answer && q.is_correct && " ✓"}
                                {key === q.user_answer && !q.is_correct && " ✗"}
                                {key === q.correct_answer &&
                                  key !== q.user_answer &&
                                  " ✓"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p
                            className={`text-sm font-semibold ${textSecondaryClass} mb-2`}
                          >
                            Your Answer
                          </p>
                          {q.user_answer ? (
                            <p
                              className={
                                q.is_correct
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }
                            >
                              <span className="font-bold">
                                {q.user_answer.toUpperCase()}.
                              </span>{" "}
                              {q.choices[q.user_answer]}
                            </p>
                          ) : (
                            <p className="text-amber-400">Not answered</p>
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold ${textSecondaryClass} mb-2`}
                          >
                            Correct Answer
                          </p>
                          <p className="text-emerald-400">
                            <span className="font-bold">
                              {q.correct_answer.toUpperCase()}.
                            </span>{" "}
                            {q.choices[q.correct_answer]}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p
                          className={`text-sm font-semibold ${textSecondaryClass} mb-2`}
                        >
                          Explanation
                        </p>
                        <p className={`text-sm ${textPrimaryClass}`}>
                          {q.explanation}
                        </p>
                      </div>

                      <p
                        className={`text-xs ${textSecondaryClass} flex items-center gap-2`}
                      >
                        <Clock className="w-4 h-4" />
                        Time: {q.time_spent}s
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
