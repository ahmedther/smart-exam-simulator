// hooks/useAutoSave.ts
import { useEffect, useRef } from "react";
import { useExamStore } from "../stores/examStore";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash"; // or custom debounce

export function useAutoSave() {
  const state = useExamStore((s) => s.state);
  const sessionId = useExamStore((s) => s.sessionId);
  const lastSavedRef = useRef<string>("");

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      answers: Array<{
        questionId: string;
        answer: string;
        timeSpent: number;
        markedForReview: boolean;
      }>;
      currentQuestionIndex: number;
      totalTimeSpent: number;
      remainingTime: number;
    }) => {
      return fetch(`/api/exam/${sessionId}/save`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    // ✅ No need to update React Query or Zustand - they're already updated optimistically
  });

  // ✅ Debounced save - saves every 30s or after 5s of inactivity
  const debouncedSave = useRef(
    debounce((data: typeof state) => {
      const serialized = JSON.stringify(data);

      // Only save if data changed
      if (serialized === lastSavedRef.current) return;

      lastSavedRef.current = serialized;

      saveMutation.mutate({
        answers: Array.from(data.answers.entries()).map(([id, ans]) => ({
          questionId: id,
          answer: ans.selectedOptionId,
          timeSpent: ans.timeSpent,
          markedForReview: ans.markedForReview,
        })),
        currentQuestionIndex: data.currentQuestionIndex,
        totalTimeSpent: data.totalTimeSpent,
        remainingTime: data.remainingTime,
      });
    }, 5000) // Save after 5s of inactivity
  ).current;

  // ✅ Auto-save on state changes
  useEffect(() => {
    debouncedSave(state);
  }, [state, debouncedSave]);

  // ✅ Periodic save every 30s (backup)
  useEffect(() => {
    const interval = setInterval(() => {
      debouncedSave(state);
      debouncedSave.flush(); // Force immediate save
    }, 30000);

    return () => {
      clearInterval(interval);
      debouncedSave.flush(); // Save on unmount
    };
  }, [state, debouncedSave]);

  // ✅ Save before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      debouncedSave.flush();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [debouncedSave]);

  return {
    isSaving: saveMutation.isPending,
    lastSaved: saveMutation.isSuccess ? new Date() : null,
  };
}
