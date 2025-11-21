import { useRef, useState } from "react";
import { useExamStore } from "../stores/examStore";
import { useCategories } from "./useCategories";
import { useChangeCategory, useClickOutside } from "../hooks";
import type { Category } from "../types";
import { toast } from "../../../utils";
import { parseInt } from "lodash";

export function useQuestionCardrefs() {
  const currentQuestion = useExamStore((s) => s.getCurrentQuestion());
  const currentAnswer = useExamStore((s) => s.getCurrentAnswer());
  const isMarked = useExamStore((s) => s.isCurrentMarked());
  const selectAnswer = useExamStore((s) => s.selectAnswer);
  const selectedAnswer = currentAnswer?.selectedOptionId;
  const currentQuestionIndex = useExamStore(
    (s) => s.state.currentQuestionIndex
  );
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const choices = ["a", "b", "c", "d"] as const;
  const { data: categories = [] } = useCategories() as { data: Category[] };
  const changeCategory = useChangeCategory();
  const pauseForActivity = useExamStore((s) => s.pauseForActivity);
  const resumeFromActivity = useExamStore((s) => s.resumeFromActivity);

  useClickOutside(
    dropdownRef,
    () => {
      setShowCategoryDropdown(false);
      changeCategory.reset();
    },
    showCategoryDropdown
  );

  const handleCategoryChange = (newCategoryId: string) => {
    if (newCategoryId === "0") return;

    if (currentQuestion!.category_id !== parseInt(newCategoryId)) {
      changeCategory.mutate({
        questionId: currentQuestion!.question_id,
        newCategoryId: parseInt(newCategoryId),
      });
    } else {
      toast.info(
        `Category not changed! Question already belongs to ${
          currentQuestion!.category_name
        }`
      );
    }

    // Auto-hide after 2 seconds
    setTimeout(() => {
      setShowCategoryDropdown(false);
      resumeFromActivity();
      changeCategory.reset();
    }, 2000);
  };

  const handleCategoryClick = () => {
    pauseForActivity();
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  return {
    currentQuestion,
    currentAnswer,
    isMarked,
    selectedAnswer,
    currentQuestionIndex,
    showCategoryDropdown,
    dropdownRef,
    categories,
    changeCategory,
    choices,
    // Actions
    selectAnswer,
    handleCategoryChange,
    handleCategoryClick,
  };
}
