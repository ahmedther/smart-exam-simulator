import { useCallback, useState } from "react";
import { useCheckActiveSession, useStartExam } from "../../exam/hooks";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useExamStore } from "../../exam/stores/examStore";

export function useCheckActiveExam() {
  const location = useLocation();
  const isOnExamPage = location.pathname.startsWith("/exam");

  const startExam = useStartExam();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const sessionId = useExamStore((s) => s.sessionId);
  const { data, isLoading } = useCheckActiveSession();
  const hasActiveSession = data?.has_active_session ?? false;

  // Use useCallback to memoize handlers and prevent unnecessary re-renders
  const handleStartNewQuizClick = useCallback(() => {
    if (hasActiveSession) {
      setShowConfirmModal(true);
    } else {
      startExam.mutate();
    }
  }, [hasActiveSession, startExam]);

  //// Handlers
  const handleConfirmNewQuiz = useCallback(() => {
    setShowConfirmModal(false);
    startExam.mutate();
  }, [startExam]);

  const handleCancelNewQuiz = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const handleResumeQuiz = async () => {
    if (!sessionId) return;
    navigate({
      to: "/exam/$sessionId",
      params: { sessionId },
    });
  };

  return {
    // State
    showConfirmModal,
    hasActiveSession,
    isLoading,
    isStarting: startExam.isPending,
    isOnExamPage,
    sessionId,

    // Handlers
    handleStartNewQuizClick,
    handleConfirmNewQuiz,
    handleCancelNewQuiz,
    handleResumeQuiz,

    // Raw data (if needed)
    data,

    // Direct access to mutation (if needed for advanced use cases)
    startExamMutation: startExam,
  };
}

export type UseExamStartReturn = ReturnType<typeof useCheckActiveExam>;
