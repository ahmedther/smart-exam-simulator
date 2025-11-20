// src/hooks/useExam.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { examApi } from "../../../api/examApi";
import { useNavigate } from "@tanstack/react-router";
import toast from "../../../utils/toast";
import { useExamStore } from "../stores/examStore";
import React from "react";

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
    onMutate: () => {
      queryClient.clear();
    },
    onSuccess: (data) => {
      // Cache the exam data
      queryClient.setQueryData(["exam-session", data.session.session_id], data);
      // ✅ Mark as fresh (not stale)

      navigate({
        to: "/exam/$sessionId",
        params: { sessionId: data.session.session_id },
      });
    },
    onError: (error) => {
      console.error("Failed to start exam:", error);
    },
  });
}

export const activeSessionQueryOptions = {
  queryKey: ["active-session"],
  queryFn: () => examApi.checkActiveSession(getBrowserFingerprint()),
};

// ✅ Hook now uses the exported options
// Hook to check for active session
export function useCheckActiveSession() {
  return useQuery(activeSessionQueryOptions);
}

export const userExamSessionOptions = (sessionId) => ({
  queryKey: ["exam-session", sessionId],
  queryFn: () => examApi.resumeSession(sessionId),
  enabled: !!sessionId,
  staleTime: Infinity, // ✅ Never consider stale
  gcTime: Infinity, // ✅ Keep forever
  refetchOnWindowFocus: false, // ✅ Don't refetch on focus
  refetchOnMount: false, // ✅ Don't refetch on mount - use cache!
  refetchOnReconnect: false, // ✅ Don't refetch on reconnect
  refetchInterval: false, // Don't auto-refetch on interval
});

// Hook to get exam session data
export function useExamSession(sessionId) {
  return useQuery(userExamSessionOptions(sessionId));
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await examApi.getCategories();
      return response.results; // Extract results in the hook
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}

export function useChangeCategory() {
  const updateQuestionCategory = useExamStore((s) => s.updateQuestionCategory);
  const sessionId = useExamStore((s) => s.sessionId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, newCategoryId }) =>
      examApi.changeCategory(questionId, newCategoryId),
    onSuccess: (data) => {
      toast.success(
        React.createElement(
          React.Fragment,
          null,
          data.message + " from ",
          React.createElement(
            "span",
            { className: "line-through text-red-600" },
            data.old_category
          ),
          " To ",
          React.createElement(
            "span",
            { className: "font-semibold text-green-600" },
            data.new_category
          )
        )
      );

      // Update the specific question in Tanstack Query cache
      queryClient.setQueryData(["exam-session", sessionId], (old) => {
        if (!old) return old;
        console.log(old);
        return {
          ...old,
          questions: old.questions.map((q) =>
            q.question_id === data.question_id
              ? {
                  ...q,
                  category_id: data.new_category_id,
                  category_name: data.new_category,
                }
              : q
          ),
        };
      });

      // Update the specific question in Zustand Store
      updateQuestionCategory(
        data.question_id,
        data.new_category_id,
        data.new_category
      );
    },
    onError: (error) => {
      // Handle error
      toast.error(`Error changing category: ${error.message}`);
    },
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
