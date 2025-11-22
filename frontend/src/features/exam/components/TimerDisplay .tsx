import { memo, useEffect } from "react";
import { useExamStore } from "../stores/examStore";
import TimeUpCard from "./TimeUpCard";

const TimerDisplay = memo(() => {
  // ✅ 1. Hooks MUST be at top
  const remainingTime = useExamStore((s) => s.state.remainingTime);
  const isPaused = useExamStore((s) => s.state.isPaused);
  const decrementTime = useExamStore((s) => s.decrementTime);

  // ✅ 2. Timer logic OUTSIDE memo component (move to ExamHeader or custom hook)
  useEffect(() => {
    if (isPaused || remainingTime <= 0) return;
    const intervalId = setInterval(decrementTime, 1000);
    return () => clearInterval(intervalId);
  }, [isPaused, remainingTime, decrementTime]);

  // ✅ 3. Remove useMemo (overkill for simple checks)
  const isLowTime = remainingTime <= 300 && remainingTime > 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (remainingTime <= 0) return <TimeUpCard />;
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-500 mb-2">Exam Time Remaining</span>
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
        </svg>{" "}
        <span
          className={`text-2xl font-bold ${
            isLowTime && !isPaused
              ? "text-red-600 animate-pulse"
              : isPaused
              ? "text-gray-400"
              : "text-gray-800"
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
      {isLowTime && !isPaused && (
        <span className="text-xs text-red-600 mt-1 font-medium">
          ⚠️ Less than 5 minutes remaining!
        </span>
      )}
      {remainingTime === 0 && (
        <span className="text-xs text-red-600 mt-1 font-bold">
          ⏰ TIME'S UP!
        </span>
      )}
    </div>
  );
});

TimerDisplay.displayName = "TimerDisplay";
export default TimerDisplay;
