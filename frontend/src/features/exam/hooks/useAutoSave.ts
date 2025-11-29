import { useEffect, useCallback } from "react";
import { useExamStore } from "../stores/examStore";
import { examApi } from "../../../api/examApi";

export function useAutoSave() {
  const isPaused = useExamStore((s) => s.state.isPaused);
  const sessionId = useExamStore((s) => s.sessionId);
  const getExamProgressPayload = useExamStore((s) => s.getExamProgressPayload);
  const hasDataChanged = useExamStore((s) => s.hasDataChanged);
  const updateSnapshot = useExamStore((s) => s.updateSnapshot);

  const performSave = useCallback(async () => {
    // Skip if no changes
    if (!hasDataChanged() || isPaused) return;

    const payload = getExamProgressPayload();
    try {
      await examApi.autoSave(sessionId, payload);
      updateSnapshot();
    } catch (error) {
      // Silent failure - just log
      console.error("[AutoSave] Failed:", error);
    }
  }, [
    hasDataChanged,
    isPaused,
    getExamProgressPayload,
    sessionId,
    updateSnapshot,
  ]);

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

        const payload = getExamProgressPayload();
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
  }, [sessionId, getExamProgressPayload, performSave]);
}
