import { useExamStore } from "../stores/examStore";

export default function ExamHeader() {
  const currentQuestionIndex = useExamStore(
    (s) => s.state.currentQuestionIndex
  );
  const isPaused = useExamStore((s) => s.state.isPaused);
  const togglePause = useExamStore((s) => s.togglePause);
  const statistics = useExamStore((s) => s.statistics);
  const session = useExamStore((s) => s.session);

  // Format remaining time from seconds
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const remainingTime = session?.remaining_time || 0;

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
            <span className="text-xl text-gray-600">
              {statistics.totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="h-2 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{
                width: `${statistics.progress}%`,
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
              {formatTime(remainingTime)}
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
