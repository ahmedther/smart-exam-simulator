/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useExamStore } from "../stores/examStore";
import { examApi } from "../../../api/examApi";
import { useCallback, useEffect, useRef } from "react";

export function useExamSubmission() {
  const queryClient = useQueryClient();
  const sessionId = useExamStore((s) => s.sessionId);
  const getExamProgressPayload = useExamStore((s) => s.getExamProgressPayload);
  const hasSubmittedRef = useRef(false);

  const mutation = useMutation({
    mutationKey: ["submit-exam", sessionId],
    mutationFn: async () => {
      const examProgressPayload = getExamProgressPayload();
      const currentSessionId = useExamStore.getState().sessionId;
      return examApi.submitExam(currentSessionId, examProgressPayload);
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: (data) => {
      console.log("[Submission] Success:", data);
      hasSubmittedRef.current = true;
      queryClient.invalidateQueries({
        queryKey: ["exam-session", sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
    onError: (error: Error) => {
      console.error("[Submission] Failed:", error);
    },
  });

  useEffect(() => {
    mutation.reset();
    hasSubmittedRef.current = false;
  }, [sessionId]);

  const submitExam = useCallback(async () => {
    if (hasSubmittedRef.current) {
      return mutation.data;
    }

    if (mutation.isPending) {
      return;
    }

    const currentSessionId = useExamStore.getState().sessionId;
    if (!currentSessionId) {
      return;
    }

    return mutation.mutateAsync();
  }, [mutation]);

  return {
    submitExam,
    isSubmitting: mutation.isPending,
    isRetrying: mutation.failureCount > 0 && mutation.isPending,
    retryCount: mutation.failureCount,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    sessionId,
  };
}
