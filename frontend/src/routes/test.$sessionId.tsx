import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { userExamSessionOptions } from "../hooks/useExam";
import { useErrorRedirect } from "../hooks/useErrorRedirect";
import Spinner from "../components/ui/Spinner";

export const Route = createFileRoute("/test/$sessionId")({
  loader: ({ context: { queryClient }, params: { sessionId } }) => {
    return queryClient.ensureQueryData(userExamSessionOptions(sessionId));
  },
  pendingComponent: () => (
    <Spinner
      fullScreen
      text="Loading Test Questions. Please Wait ..."
      size="lg"
    />
  ),
  errorComponent: useErrorRedirect,
  component: TestComponent,
});

function TestComponent() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Assessment and Diagnosis"
  );
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([
    12, 45, 89,
  ]); // Example marked questions

  const totalQuestions = 225;
  const examDuration = "4:30:00"; // 4.5 hours

  // Sample question data
  const question = {
    text: "The best predictor of treatment outcome among adult substance abusers is:",
    options: [
      { id: "a", text: "age" },
      { id: "b", text: "ethnicity" },
      { id: "c", text: "history of criminal behavior" },
      { id: "d", text: "severity of substance abuse problems" },
    ],
  };

  const categories = [
    "Assessment and Diagnosis",
    "Treatment Planning",
    "Counseling",
    "Professional Responsibility",
    "Ethics",
    "Case Management",
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Resume timer when category is selected
    setIsPaused(false);
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setShowCategoryDropdown(false);
    }, 2000);
  };

  const handleCategoryEdit = () => {
    // Pause timer when editing category
    setIsPaused(true);
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const toggleMarkForReview = () => {
    if (markedQuestions.includes(currentQuestion)) {
      setMarkedQuestions(markedQuestions.filter((q) => q !== currentQuestion));
    } else {
      setMarkedQuestions([...markedQuestions, currentQuestion]);
    }
  };

  const isMarked = markedQuestions.includes(currentQuestion);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full space-y-6">
        {/* Header Stats Bar */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question Progress */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500 mb-2">
                Question Progress
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {currentQuestion}
                </span>
                <span className="text-xl text-gray-400">/</span>
                <span className="text-xl text-gray-600">{totalQuestions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                  style={{
                    width: `${(currentQuestion / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Exam Timer */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500 mb-2">
                Exam Time Remaining
              </span>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span
                  className={`text-2xl font-bold ${
                    isPaused ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  {examDuration}
                </span>
              </div>
              {isPaused && (
                <span className="text-xs text-amber-600 mt-1 font-medium">
                  ⏸ PAUSED
                </span>
              )}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                isPaused
                  ? "bg-linear-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
                  : "bg-linear-to-r from-amber-600 to-orange-600 text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              {isPaused ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Resume Timer
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  Pause Timer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Marked Questions Panel */}
        {markedQuestions.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-amber-900">
                  {markedQuestions.length} Question
                  {markedQuestions.length !== 1 ? "s" : ""} Marked for Review
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {markedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setCurrentQuestion(q)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all duration-200 ${
                      q === currentQuestion
                        ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white text-amber-700 hover:bg-amber-100 border border-amber-300"
                    }`}
                  >
                    #{q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-block px-4 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold">
                Question {currentQuestion}
              </div>
              {isMarked && (
                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Marked
                </div>
              )}
            </div>

            {/* Category Display with Edit Button */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="text-sm font-semibold text-indigo-900">
                  {selectedCategory}
                </span>
                <button
                  onClick={handleCategoryEdit}
                  className="ml-2 p-1 hover:bg-indigo-100 rounded transition-colors duration-200"
                  title="Edit category"
                >
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>

              {/* Category Dropdown - positioned relative to category badge */}
              {showCategoryDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-white rounded-xl border-2 border-indigo-200 shadow-xl z-10">
                  <label className="block text-sm font-semibold text-indigo-900 mb-2">
                    Correct the Question Category:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 rounded-lg border-2 border-indigo-300 focus:border-indigo-600 focus:outline-none bg-white text-gray-800 font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-indigo-600">
                    ✓ Will auto-close in a moment...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {question.text}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedAnswer(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === option.id
                    ? "border-indigo-600 bg-linear-to-r from-indigo-50 to-purple-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Radio Circle */}
                  <div
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedAnswer === option.id
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === option.id && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>

                  {/* Option Content */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg font-bold text-indigo-600">
                      {option.id}.
                    </span>
                    <span className="text-lg text-gray-700 font-medium">
                      {option.text}
                    </span>
                  </div>

                  {/* Selected Checkmark */}
                  {selectedAnswer === option.id && (
                    <svg
                      className="w-6 h-6 text-indigo-600 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              disabled={currentQuestion === 1}
              className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex gap-3">
              <button
                onClick={toggleMarkForReview}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isMarked
                    ? "bg-amber-100 border-2 border-amber-400 text-amber-700 hover:bg-amber-200"
                    : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isMarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {isMarked ? "Unmark" : "Mark for Review"}
              </button>
              <button className="px-8 py-3 rounded-xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2">
                Next Question
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
