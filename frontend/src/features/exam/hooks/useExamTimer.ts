import { useCallback } from "react";
import { useExamStore } from "../stores/examStore";

export function useExamTimer() {
  const isPaused = useExamStore((s) => s.state.isPaused);
  const questionStartTime = useExamStore((s) => s.state.questionStartTime);
  //   const timerRef = useRef<number>();

  const getTimeSpent = useCallback(() => {
    if (isPaused) return 0;
    return Math.floor((Date.now() - questionStartTime) / 1000);
  }, [isPaused, questionStartTime]);

  return { getTimeSpent };
}
