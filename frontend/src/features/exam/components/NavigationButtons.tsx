import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useNavigationButtons } from "../hooks";

export default function NavigationButtons() {
  const page = useNavigationButtons();

  return (
    <>
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          disabled={page.isFirstQuestion}
          onClick={page.previousQuestion}
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
            onClick={page.toggleMark}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              page.isMarked
                ? "bg-amber-100 border-2 border-amber-400 text-amber-700 hover:bg-amber-200"
                : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={page.isMarked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                clipRule="evenodd"
              />
            </svg>
            {page.isMarked ? "Unmark" : "Mark for Review"}
          </button>

          {page.isLastQuestion ? (
            <button
              onClick={page.handleSubmitClick}
              disabled={page.isSubmitting}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 text-white ${
                page.isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-green-600 to-emerald-600 hover:shadow-xl"
              }`}
            >
              {page.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {page.isRetrying
                    ? `Retrying (${page.retryCount}/3)...`
                    : "Submitting..."}
                </span>
              ) : (
                "Submit Exam"
              )}
            </button>
          ) : (
            <button
              onClick={page.nextQuestion}
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

        <ConfirmModal
          isOpen={page.showSubmitModal}
          onConfirm={page.handleConfirmSubmit}
          onCancel={() => page.setShowSubmitModal(false)}
          title="Submit Exam?"
          message={
            page.unansweredCount > 0
              ? `You still have ${page.unansweredCount} unanswered question${
                  page.unansweredCount === 1 ? "" : "s"
                }. Your exam will be graded based on answered questions only.`
              : "Once submitted, you won't be able to change your answers. Ready to submit?"
          }
          confirmText="Yes, Submit Exam"
          cancelText="Review Answers"
          variant="success"
        />
      </div>
      {page.isError && page.isLastQuestion && (
        <p className="text-red-600 text-sm mt-2 text-right w-full">
          Submission failed. Click submit to retry.
        </p>
      )}
    </>
  );
}
