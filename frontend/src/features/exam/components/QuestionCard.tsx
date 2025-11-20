import { AnimatePresence, motion } from "framer-motion";
import NavigationButtons from "./NavigationButtons";
import { capitalizeFirst } from "../../../utils/string";
import Spinner from "../../../components/ui/Spinner";
import useQuestionCardrefs from "../hooks/useQuestionCardrefs";

export default function QuestionCard() {
  const page = useQuestionCardrefs();

  if (!page.currentQuestion) {
    return <Spinner text="Loading Questions..." size="lg" />;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-block px-4 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold">
            Question {page.currentQuestionIndex + 1}
          </div>
          {page.isMarked && (
            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
        <div className="relative" ref={page.dropdownRef}>
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
              {page.currentQuestion.category_name}
            </span>
            <button
              onClick={() => page.setShowCategoryDropdown((prev) => !prev)}
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
          <AnimatePresence>
            {page.showCategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-80 p-4 bg-white rounded-xl border-2 border-indigo-200 shadow-xl z-10"
              >
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Correct the Question Category:
                </label>
                <select
                  defaultValue="0"
                  onChange={(e) => page.handleCategoryChange(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-indigo-300 focus:border-indigo-600 focus:outline-none bg-white text-gray-800 font-medium"
                >
                  <option value={"0"}>-- Select a category --</option>
                  {page.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {!page.changeCategory.isPending &&
                  !page.changeCategory.isSuccess &&
                  !page.changeCategory.isError && (
                    <p className="mt-2 text-xs text-indigo-600">
                      ✓ Will auto-close in a moment...
                    </p>
                  )}
                {page.changeCategory.isPending && (
                  <p className="mt-2 text-xs font-bold text-indigo-600">
                    ⏳ Updating category...
                  </p>
                )}

                {page.changeCategory.isSuccess && (
                  <p className="mt-2 text-xs font-bold text-green-600">
                    ✓ Category updated! Closing...
                  </p>
                )}

                {page.changeCategory.isError && (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    ✗ Failed to update. Please try again.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed ">
        {capitalizeFirst(page.currentQuestion?.question_text.trim())}
      </h2>

      {/* Answer Options */}
      <div className="space-y-4">
        {page.choices.map((letter) => (
          <button
            key={letter}
            onClick={() => page.selectAnswer(letter)}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
              page.selectedAnswer === letter
                ? "border-indigo-600 bg-linear-to-r from-indigo-50 to-purple-50 shadow-md scale-[1.02]"
                : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Radio Circle */}
              <div
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  page.selectedAnswer === letter
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {page.selectedAnswer === letter && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>

              {/* Option Content */}
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg font-bold text-indigo-600">
                  {letter.toUpperCase()}.
                </span>
                <span className="text-lg text-gray-700 font-medium ">
                  {capitalizeFirst(
                    page.currentQuestion![`choice_${letter}`].trim()
                  )}
                </span>
              </div>

              {/* Selected Checkmark */}
              {page.selectedAnswer === letter && (
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
      <NavigationButtons />
    </div>
  );
}
