import { useEffect, useRef, useCallback } from "react";
import { useExamStore } from "../stores/examStore";
import { examApi } from "../../../api/examApi";
import type { AutoSaveInput, AutoSavePayload } from "../types";

export function useAutoSave() {
  const sessionId = useExamStore((s) => s.sessionId);
  const lastSavedStrRef = useRef("");

  const preparePayload = useCallback(
    (data: AutoSaveInput): AutoSavePayload => ({
      total_time_spent: data.totalTimeSpent,
      current_question_number: data.currentQuestionIndex + 1,
      answers: Array.from(data.answers.entries())
        .filter(([, ans]) => ans.selectedOptionId !== null)
        .map(([qId, ans]) => ({
          question_id: qId,
          user_answer: ans.selectedOptionId!,
          time_spent: ans.timeSpent,
          marked_for_review: data.markedQuestions.has(qId),
        })),
    }),
    []
  );

  const performSave = useCallback(async () => {
    const currentQuestionIndex =
      useExamStore.getState().state.currentQuestionIndex;
    const totalTimeSpent = useExamStore.getState().state.totalTimeSpent;
    const answers = useExamStore.getState().state.answers;
    const markedQuestions = useExamStore.getState().state.markedQuestions;

    const serialized = JSON.stringify({
      answers: Array.from(answers.entries()),
      marked: Array.from(markedQuestions),
      index: currentQuestionIndex,
    });

    if (serialized === lastSavedStrRef.current) return;

    const payload = preparePayload({
      currentQuestionIndex,
      totalTimeSpent,
      answers,
      markedQuestions,
    });

    await examApi.autoSave(sessionId, payload);
    lastSavedStrRef.current = serialized;
  }, [sessionId, preparePayload]);

  // ✅ Periodic backup every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      performSave();
    }, 30000);

    return () => clearInterval(interval);
  }, [performSave]);

  // ✅ Save on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        performSave().catch((err) => console.error("Save failed:", err));

        const currentQuestionIndex =
          useExamStore.getState().state.currentQuestionIndex;
        const totalTimeSpent = useExamStore.getState().state.totalTimeSpent;
        const answers = useExamStore.getState().state.answers;
        const markedQuestions = useExamStore.getState().state.markedQuestions;

        const payload = preparePayload({
          currentQuestionIndex,
          totalTimeSpent,
          answers,
          markedQuestions,
        });

        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });

        navigator.sendBeacon(
          `${window.location.origin}/api/exam-sessions/${sessionId}/autosave/`,
          blob
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [sessionId, preparePayload, performSave]);
}
