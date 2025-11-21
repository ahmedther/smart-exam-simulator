import { useEffect, useMemo } from "react";
import { useExamStore } from "../stores/examStore";

export function useExamHeaderTimer() {
  // Selectors
  const currentQuestionIndex = useExamStore(
    (s) => s.state.currentQuestionIndex
  );
  const isPaused = useExamStore((s) => s.state.isPaused);
  const remainingTime = useExamStore((s) => s.state.remainingTime);
  const statistics = useExamStore((s) => s.statistics);

  // Actions
  const togglePause = useExamStore((s) => s.togglePause);
  const decrementTime = useExamStore((s) => s.decrementTime);

  // Countdown timer effect
  useEffect(() => {
    if (isPaused || remainingTime <= 0) {
      return;
    }

    const intervalId = setInterval(decrementTime, 1000);
    return () => clearInterval(intervalId);
  }, [isPaused, remainingTime, decrementTime]);

  // Memoized computed values
  const isLowTime = useMemo(
    () => remainingTime <= 300 && remainingTime > 0,
    [remainingTime]
  );

  const isTimeUp = useMemo(() => remainingTime === 0, [remainingTime]);

  // Format time helper (could also be memoized if performance-critical)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formattedTime = useMemo(
    () => formatTime(remainingTime),
    [remainingTime]
  );

  return {
    // State
    currentQuestionIndex,
    isPaused,
    remainingTime,
    statistics,

    // Computed
    isLowTime,
    isTimeUp,
    formattedTime,

    // Actions
    togglePause,

    // Helpers
    formatTime, // Keep this if you need it elsewhere
  } as const; // ✅ Makes return type readonly for better type safety
}
