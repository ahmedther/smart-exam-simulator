import { useCallback, useState } from "react";
import { useCheckActiveSession, useStartExam } from "../../../hooks/useExam";

export default function useCheckActiveExam() {
  const startExam = useStartExam();
  const { data: activeSession, isLoading } = useCheckActiveSession();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const hasActiveSession = activeSession?.has_active_session ?? false;

  // Use useCallback to memoize handlers and prevent unnecessary re-renders
  const handleStartNewQuizClick = useCallback(() => {
    if (hasActiveSession) {
      setShowConfirmModal(true);
    } else {
      startExam.mutate();
    }
  }, [hasActiveSession, startExam]);

  const handleConfirmNewQuiz = useCallback(() => {
    setShowConfirmModal(false);
    startExam.mutate();
  }, [startExam]);

  const handleCancelNewQuiz = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  return {
    // State
    showConfirmModal,
    hasActiveSession,
    isLoading,
    isStarting: startExam.isPending,

    // Handlers
    handleStartNewQuizClick,
    handleConfirmNewQuiz,
    handleCancelNewQuiz,

    // Raw data (if needed)
    activeSession,

    // Direct access to mutation (if needed for advanced use cases)
    startExamMutation: startExam,
  };
}

export type UseExamStartReturn = ReturnType<typeof useCheckActiveExam>;
