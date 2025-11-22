import { useExamStore } from "../stores/examStore";
import TimerDisplay from "./TimerDisplay ";

export default function ExamHeader() {
  const currentQuestionIndex = useExamStore(
    (s) => s.state.currentQuestionIndex
  );
  const totalQuestions = useExamStore((s) => s.questions.length);
  const answersSize = useExamStore((s) => s.state.answers.size);

  const progress =
    totalQuestions > 0 ? (answersSize / totalQuestions) * 100 : 0;
  const togglePause = useExamStore((s) => s.togglePause);
  const isPaused = useExamStore((s) => s.state.isPaused);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Progress */}
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">Question Progress</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {currentQuestionIndex + 1}
            </span>
            <span className="text-xl text-gray-400">/</span>
            <span className="text-xl text-gray-600">{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="h-2 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
        {/* Exam Timer */}
        <TimerDisplay />
      </div>

      {/* Timer Controls */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={togglePause}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
            isPaused
              ? "bg-linear-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
              : "bg-linear-to-r from-amber-600 to-orange-600 text-white hover:shadow-lg hover:scale-105"
          }`}
        >
          {isPaused ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Resume Timer
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              Pause Timer
            </>
          )}
        </button>
      </div>
    </div>
  );
}
