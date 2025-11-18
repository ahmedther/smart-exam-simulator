import { useCallback, useState } from "react";
import {
  useCheckActiveSession,
  userExamSessionOptions,
  useStartExam,
} from "../../../hooks/useExam";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { queryClient } from "../../../utils/queryClient";
import { useExamStore } from "../../exam/stores/examStore";

export default function useCheckActiveExam() {
  const startExam = useStartExam();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnExamPage = location.pathname.startsWith("/exam");

  const { data, isLoading } = useCheckActiveSession();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const initialize = useExamStore((s) => s.initialize);
  const sessionId = useExamStore((s) => s.sessionId);

  const hasActiveSession = data?.has_active_session ?? false;

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

  const handleResumeQuiz = async () => {
    if (!sessionId) return;
    const examData = await queryClient.fetchQuery(
      userExamSessionOptions(sessionId)
    );
    initialize(examData);
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
