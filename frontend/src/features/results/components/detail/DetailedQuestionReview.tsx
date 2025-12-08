import { useState } from "react";
import type { QuestionReview } from "../../types";
import {
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";
import { capitalize } from "lodash";

type Props = {
  isDark: boolean;
  cardClass: string;
  textPrimaryClass: string;
  questions: QuestionReview[];
};

export function DetailedQuestionReview({
  isDark,
  cardClass,
  textPrimaryClass,
  questions,
}: Props) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const getChoicesObject = (question: QuestionReview) => {
    return {
      a: question.choice_a,
      b: question.choice_b,
      c: question.choice_c,
      d: question.choice_d,
    };
  };

  // Ultra-modern status styling with glow effects
  const getQuestionCardStyle = (
    question: QuestionReview,
    isExpanded: boolean
  ) => {
    const baseStyle = "relative overflow-hidden transition-all duration-300";

    if (question.is_correct) {
      return isDark
        ? `${baseStyle} bg-linear-to-br from-emerald-500/20 to-teal-500/20 border-emerald-400/50 hover:border-emerald-400/80 hover:shadow-lg hover:shadow-emerald-500/20 ${
            isExpanded
              ? "shadow-xl shadow-emerald-500/20 border-emerald-400/80"
              : ""
          }`
        : `${baseStyle} bg-linear-to-br from-emerald-50 to-teal-50 border-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-200/50 ${
            isExpanded ? "shadow-xl shadow-emerald-200/50" : ""
          }`;
    } else if (question.is_correct === false) {
      return isDark
        ? `${baseStyle} bg-linear-to-br from-rose-500/20 to-pink-500/20 border-rose-400/50 hover:border-rose-400/80 hover:shadow-lg hover:shadow-rose-500/20 ${
            isExpanded ? "shadow-xl shadow-rose-500/20 border-rose-400/80" : ""
          }`
        : `${baseStyle} bg-linear-to-br from-rose-50 to-pink-50 border-rose-300 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-200/50 ${
            isExpanded ? "shadow-xl shadow-rose-200/50" : ""
          }`;
    } else {
      return isDark
        ? `${baseStyle} bg-linear-to-br from-amber-500/20 to-orange-500/20 border-amber-400/50 hover:border-amber-400/80 hover:shadow-lg hover:shadow-amber-500/20 ${
            isExpanded
              ? "shadow-xl shadow-amber-500/20 border-amber-400/80"
              : ""
          }`
        : `${baseStyle} bg-linear-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-200/50 ${
            isExpanded ? "shadow-xl shadow-amber-200/50" : ""
          }`;
    }
  };

  const getStatusIcon = (question: QuestionReview) => {
    if (question.is_correct) {
      return (
        <CheckCircle2
          className={`w-5 h-5 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}
        />
      );
    } else if (question.is_correct === false) {
      return (
        <XCircle
          className={`w-5 h-5 ${isDark ? "text-rose-400" : "text-rose-600"}`}
        />
      );
    } else {
      return (
        <MinusCircle
          className={`w-5 h-5 ${isDark ? "text-amber-400" : "text-amber-600"}`}
        />
      );
    }
  };

  const getStatusBadge = (question: QuestionReview) => {
    if (question.is_correct) {
      return isDark
        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm shadow-emerald-500/20"
        : "bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm";
    } else if (question.is_correct === false) {
      return isDark
        ? "bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-sm shadow-rose-500/20"
        : "bg-rose-100 text-rose-700 border border-rose-300 shadow-sm";
    } else {
      return isDark
        ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-500/20"
        : "bg-amber-100 text-amber-700 border border-amber-300 shadow-sm";
    }
  };

  const getCategoryBadge = () => {
    return isDark
      ? "bg-linear-to-br from-slate-700/90 to-slate-600/90 text-slate-200 border border-slate-500/50 shadow-sm backdrop-blur-sm"
      : "bg-linear-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300 shadow-sm";
  };

  const getChoiceStyle = (
    key: string,
    userAnswer: string | null,
    correctAnswer: string,
    isCorrect: boolean | null
  ) => {
    const isUserChoice = key === userAnswer;
    const isCorrectAnswer = key === correctAnswer;
    const baseTransition = "transition-all duration-200 hover:scale-[1.01]";

    if (isUserChoice && isCorrect) {
      return isDark
        ? `${baseTransition} bg-linear-to-br from-emerald-500/30 to-teal-500/30 border-emerald-400/70 ring-2 ring-emerald-400/40 shadow-md shadow-emerald-500/20`
        : `${baseTransition} bg-linear-to-br from-emerald-100 to-teal-50 border-emerald-400 ring-2 ring-emerald-300/50 shadow-md shadow-emerald-200/30`;
    } else if (isUserChoice && !isCorrect) {
      return isDark
        ? `${baseTransition} bg-linear-to-br from-rose-500/30 to-pink-500/30 border-rose-400/70 ring-2 ring-rose-400/40 shadow-md shadow-rose-500/20`
        : `${baseTransition} bg-linear-to-br from-rose-100 to-pink-50 border-rose-400 ring-2 ring-rose-300/50 shadow-md shadow-rose-200/30`;
    } else if (isCorrectAnswer) {
      return isDark
        ? `${baseTransition} bg-linear-to-br from-emerald-500/15 to-teal-500/15 border-emerald-500/50 shadow-sm`
        : `${baseTransition} bg-linear-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-sm`;
    } else {
      return isDark
        ? `${baseTransition} bg-slate-700/60 border-slate-600/60 hover:bg-slate-700/80 hover:border-slate-500/60`
        : `${baseTransition} bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400`;
    }
  };

  const getAnswerBoxStyle = (isCorrect: boolean | null) => {
    if (isCorrect) {
      return isDark
        ? "bg-linear-to-br from-emerald-500/15 to-teal-500/15 border-emerald-400/40 shadow-sm"
        : "bg-linear-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm";
    } else if (isCorrect === false) {
      return isDark
        ? "bg-linear-to-br from-rose-500/15 to-pink-500/15 border-rose-400/40 shadow-sm"
        : "bg-linear-to-br from-rose-50 to-pink-50 border-rose-200 shadow-sm";
    }
    return isDark
      ? "bg-slate-700/40 border-slate-600/50 shadow-sm"
      : "bg-gray-50 border-gray-200 shadow-sm";
  };

  const getAnswerTextStyle = (isCorrect: boolean | null) => {
    if (isCorrect) {
      return isDark
        ? "text-emerald-300 font-semibold"
        : "text-emerald-700 font-semibold";
    } else {
      return isDark
        ? "text-rose-300 font-semibold"
        : "text-rose-700 font-semibold";
    }
  };

  return (
    <div className={cardClass}>
      <div className="flex items-center gap-3 mb-6">
        <h2 className={`text-2xl font-bold ${textPrimaryClass}`}>
          Question Review
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isDark
              ? "bg-violet-500/20 text-violet-300 border border-violet-400/40"
              : "bg-purple-100 text-purple-700 border border-purple-300"
          }`}
        >
          {questions.length} Questions
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q: QuestionReview, idx: number) => {
          const choices = getChoicesObject(q);
          const isExpanded = expandedQuestion === idx;

          return (
            <div
              key={q.question_number}
              onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
              className={`p-5 rounded-xl cursor-pointer border-2 ${getQuestionCardStyle(
                q,
                isExpanded
              )}`}
            >
              {/* Subtle gradient overlay for depth */}
              <div
                className={`absolute inset-0 rounded-xl pointer-events-none ${
                  isDark
                    ? "bg-linear-to-br from-white/[0.2] to-transparent"
                    : "bg-linear-to-br from-white/60 to-transparent"
                }`}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusBadge(
                        q
                      )}`}
                    >
                      {getStatusIcon(q)}
                      <span className="text-sm font-bold">
                        Q{q.question_number}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getCategoryBadge()}`}
                    >
                      {q.category}
                    </div>
                  </div>

                  <p
                    className={`font-semibold text-base leading-relaxed ${textPrimaryClass}`}
                  >
                    {q.question_text.substring(0, 120)}
                    {q.question_text.length > 120 && "..."}
                  </p>
                </div>

                <div
                  className={`shrink-0 p-2 rounded-lg transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700/50 hover:bg-slate-700/80 text-slate-300"
                      : "bg-white/80 hover:bg-gray-100 text-gray-600"
                  } ${isExpanded ? "rotate-180" : ""}`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>

              {isExpanded && (
                <div
                  className={`relative mt-5 pt-5 border-t-2 ${
                    isDark ? "border-slate-600/50" : "border-indigo-200/60"
                  } animate-in fade-in slide-in-from-top-2 duration-300`}
                >
                  <div className="space-y-5">
                    {/* Full Question */}
                    <div
                      className={`p-4 rounded-xl border ${
                        isDark
                          ? "bg-slate-800/40 border-slate-700/50"
                          : "bg-white/60 border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-sm font-bold ${
                          isDark ? "text-violet-300" : "text-purple-700"
                        } mb-2 uppercase tracking-wide`}
                      >
                        Full Question
                      </p>
                      <p className={`${textPrimaryClass} leading-relaxed`}>
                        {q.question_text.trim()}
                      </p>
                    </div>

                    {/* All Choices with modern card design */}
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          isDark ? "text-violet-300" : "text-purple-700"
                        } mb-3 uppercase tracking-wide`}
                      >
                        Answer Choices
                      </p>
                      <div className="grid gap-2.5">
                        {Object.entries(choices).map(([key, value]) => {
                          const choiceStyle = getChoiceStyle(
                            key,
                            q.user_answer,
                            q.correct_answer,
                            q.is_correct
                          );
                          return (
                            <div
                              key={key}
                              className={`p-4 rounded-xl border-2 ${choiceStyle}`}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg font-bold text-sm ${
                                    key === q.user_answer && q.is_correct
                                      ? isDark
                                        ? "bg-emerald-500/40 text-emerald-200"
                                        : "bg-emerald-200 text-emerald-800"
                                      : key === q.user_answer && !q.is_correct
                                      ? isDark
                                        ? "bg-rose-500/40 text-rose-200"
                                        : "bg-rose-200 text-rose-800"
                                      : key === q.correct_answer
                                      ? isDark
                                        ? "bg-emerald-500/30 text-emerald-300"
                                        : "bg-emerald-100 text-emerald-700"
                                      : isDark
                                      ? "bg-slate-600/60 text-slate-300"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {key.toUpperCase()}
                                </span>
                                <p
                                  className={`flex-1 ${textPrimaryClass} leading-relaxed`}
                                >
                                  {capitalize(value)}
                                </p>
                                {key === q.user_answer && q.is_correct && (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                )}
                                {key === q.user_answer && !q.is_correct && (
                                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                                )}
                                {key === q.correct_answer &&
                                  key !== q.user_answer && (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Answer Comparison with enhanced design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        className={`p-4 rounded-xl border-2 ${getAnswerBoxStyle(
                          false
                        )}`}
                      >
                        <p
                          className={`text-xs font-bold ${
                            isDark ? "text-slate-400" : "text-gray-600"
                          } mb-2 uppercase tracking-wider`}
                        >
                          Your Answer
                        </p>
                        {q.user_answer ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 flex items-center justify-center rounded-lg font-bold text-sm ${
                                q.is_correct
                                  ? isDark
                                    ? "bg-emerald-500/40 text-emerald-200"
                                    : "bg-emerald-200 text-emerald-800"
                                  : isDark
                                  ? "bg-rose-500/40 text-rose-200"
                                  : "bg-rose-200 text-rose-800"
                              }`}
                            >
                              {q.user_answer.toUpperCase()}
                            </span>
                            <p
                              className={`text-sm ${getAnswerTextStyle(
                                q.is_correct
                              )}`}
                            >
                              {capitalize(
                                choices[q.user_answer as keyof typeof choices]
                              )}
                            </p>
                          </div>
                        ) : (
                          <p
                            className={`text-sm font-semibold ${
                              isDark ? "text-amber-300" : "text-amber-700"
                            }`}
                          >
                            Not answered
                          </p>
                        )}
                      </div>

                      <div
                        className={`p-4 rounded-xl border-2 ${getAnswerBoxStyle(
                          true
                        )}`}
                      >
                        <p
                          className={`text-xs font-bold ${
                            isDark ? "text-slate-400" : "text-gray-600"
                          } mb-2 uppercase tracking-wider`}
                        >
                          Correct Answer
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-lg font-bold text-sm ${
                              isDark
                                ? "bg-emerald-500/40 text-emerald-200"
                                : "bg-emerald-200 text-emerald-800"
                            }`}
                          >
                            {q.correct_answer.toUpperCase()}
                          </span>
                          <p
                            className={`text-sm ${
                              isDark
                                ? "text-emerald-300 font-semibold"
                                : "text-emerald-700 font-semibold"
                            }`}
                          >
                            {capitalize(
                              choices[q.correct_answer as keyof typeof choices]
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Explanation with premium styling */}
                    <div
                      className={`p-5 rounded-xl border-2 ${
                        isDark
                          ? "bg-linear-to-br from-violet-500/15 to-purple-500/15 border-violet-400/50 shadow-lg shadow-violet-500/10"
                          : "bg-linear-to-br from-purple-50 to-indigo-50 border-purple-300 shadow-lg shadow-purple-200/20"
                      }`}
                    >
                      <p
                        className={`text-sm font-bold ${
                          isDark ? "text-violet-300" : "text-purple-700"
                        } mb-3 uppercase tracking-wide flex items-center gap-2`}
                      >
                        <span
                          className={`w-6 h-6 flex items-center justify-center rounded-lg ${
                            isDark ? "bg-violet-500/30" : "bg-purple-200"
                          }`}
                        >
                          💡
                        </span>
                        Explanation
                      </p>
                      <p
                        className={`text-md leading-relaxed ${
                          isDark ? "text-slate-200" : "text-gray-700"
                        }`}
                      >
                        {q.explanation}
                      </p>
                    </div>

                    {/* Time with enhanced badge */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg w-fit ${
                        isDark
                          ? "bg-slate-700/50 border border-slate-600/50"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <Clock
                        className={`w-4 h-4 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          isDark ? "text-slate-300" : "text-gray-700"
                        }`}
                      >
                        {q.time_spent}s
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
