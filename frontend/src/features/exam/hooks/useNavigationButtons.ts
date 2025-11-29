import { useState } from "react";
import { useExamStore } from "../stores/examStore";
import { useExamSubmission } from "./useExamSubmission";

export const useNavigationButtons = () => {
  const isMarked = useExamStore((s) => s.isCurrentMarked());
  const toggleMark = useExamStore((s) => s.toggleMark);

  const currentQuestionIndex = useExamStore(
    (s) => s.state.currentQuestionIndex
  );
  const questions = useExamStore((s) => s.questions);
  const nextQuestion = useExamStore((s) => s.nextQuestion);
  const previousQuestion = useExamStore((s) => s.previousQuestion);
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const answers = useExamStore((s) => s.state.answers);

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const unansweredCount =
    questions.length -
    Array.from(answers.values()).filter((a) => a.selectedOptionId !== null)
      .length;

  const { submitExam, isSubmitting, isRetrying, isError, retryCount } =
    useExamSubmission();

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    submitExam();
  };

  return {
    isMarked,
    currentQuestionIndex,
    questions,
    isFirstQuestion,
    isLastQuestion,
    answers,
    showSubmitModal,
    unansweredCount,
    isSubmitting,
    isRetrying,
    isError,
    retryCount,
    toggleMark,
    nextQuestion,
    previousQuestion,
    setShowSubmitModal,
    handleSubmitClick,
    handleConfirmSubmit,
  };
};
