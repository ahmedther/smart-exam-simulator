import { useExamStore } from "../stores/examStore";

export default function NavigationButtons() {
  const isMarked = useExamStore((s) => s.isCurrentMarked());
  const toggleMark = useExamStore((s) => s.toggleMark);

  const currentQuestionIndex = useExamStore(
    (s) => s.state.currentQuestionIndex
  );
  const questions = useExamStore((s) => s.questions);
  const nextQuestion = useExamStore((s) => s.nextQuestion);
  const previousQuestion = useExamStore((s) => s.previousQuestion);
  const submitExam = useExamStore((s) => s.submitExam);

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        disabled={isFirstQuestion}
        onClick={previousQuestion}
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
          onClick={toggleMark}
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
        {isLastQuestion ? (
          <button
            onClick={submitExam}
            className="px-8 py-3 rounded-xl font-semibold bg-linear-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl transition-all duration-200"
          >
            Submit Exam
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-8 py-3 rounded-xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
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
        )}
      </div>
    </div>
  );
}
