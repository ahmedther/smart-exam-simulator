// src/hooks/useExam.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { examApi } from "../api/examApi";
import { useNavigate } from "@tanstack/react-router";

// Get browser fingerprint (you can use a library like fingerprintjs2 for better implementation)
const getBrowserFingerprint = () => {
  const stored = localStorage.getItem("browser_fingerprint");
  if (stored) return stored;

  const fingerprint = `browser-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  localStorage.setItem("browser_fingerprint", fingerprint);
  return fingerprint;
};

// Hook to start a new exam
export function useStartExam() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => examApi.startExam(getBrowserFingerprint()),
    onSuccess: (data) => {
      // Cache the exam data
      queryClient.setQueryData(["exam-session", data.session.session_id], data);

      // Navigate to test page with session ID
      navigate({
        to: "/test/$sessionId",
        params: { sessionId: data.session.session_id },
      });
    },
    onError: (error) => {
      console.error("Failed to start exam:", error);
      alert("Failed to start exam. Please try again.");
    },
  });
}

export const activeSessionQueryOptions = {
  queryKey: ["active-session"],
  queryFn: () => examApi.checkActiveSession(getBrowserFingerprint()),
  staleTime: 0,
};

// ✅ Hook now uses the exported options
// Hook to check for active session
export function useCheckActiveSession() {
  return useQuery(activeSessionQueryOptions);
}

// Hook to get exam session data
export function useExamSession(sessionId) {
  return useQuery({
    queryKey: ["exam-session", sessionId],
    queryFn: () => examApi.resumeSession(sessionId),
    enabled: !!sessionId,
    staleTime: Infinity, // Don't refetch unless explicitly invalidated
  });
}

// Hook to submit answer
export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, userAnswer, timeSpent }) =>
      examApi.submitAnswer(questionId, userAnswer, timeSpent),
    onSuccess: (data, variables) => {
      // Update the specific question in cache
      queryClient.invalidateQueries(["exam-session"]);
    },
  });
}

// Hook to toggle mark
export function useToggleMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId) => examApi.toggleMark(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["exam-session"]);
    },
  });
}

// Hook for autosave
export function useAutosave() {
  return useMutation({
    mutationFn: ({ sessionId, totalTimeSpent, currentQuestionNumber }) =>
      examApi.autosave(sessionId, totalTimeSpent, currentQuestionNumber),
  });
}

// Hook to submit exam
export function useSubmitExam() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, totalTimeSpent }) =>
      examApi.submitExam(sessionId, totalTimeSpent),
    onSuccess: (data) => {
      queryClient.setQueryData(["exam-results", data.session.session_id], data);
      navigate({
        to: "/results/$sessionId",
        params: { sessionId: data.session.session_id },
      });
    },
  });
}
