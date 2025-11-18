import { useExamStore } from "../stores/examStore";

export default function MarkedQuestionsPanel() {
  const markedQuestions = useExamStore((s) => s.state.markedQuestions);
  const questions = useExamStore((s) => s.questions);
  const goToQuestion = useExamStore((s) => s.goToQuestion);
  const currentQuestionIndex = useExamStore(
    (s) => s.state.currentQuestionIndex
  );

  // Get question numbers of marked questions
  const markedQuestionNumbers = Array.from(markedQuestions)
    .map((qId) => {
      const index = questions.findIndex((q) => String(q.id) === qId);
      return index >= 0 ? { index, number: index + 1 } : null;
    })
    .filter((item): item is { index: number; number: number } => item !== null)
    .sort((a, b) => a.number - b.number);

  if (markedQuestionNumbers.length === 0) return null;

  return (
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
            {markedQuestionNumbers.length} Question
            {markedQuestionNumbers.length !== 1 ? "s" : ""} Marked for Review
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {markedQuestionNumbers.map((q) => (
            <button
              key={q.index}
              onClick={() => goToQuestion(q.index)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all duration-200 ${
                q.index === currentQuestionIndex
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-white text-amber-700 hover:bg-amber-100 border border-amber-300"
              }`}
            >
              #{q.number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
