import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useExamStore } from "../stores/examStore";
import { toast } from "../../../utils";
import React from "react";
import { examApi } from "../../../api/examApi";
import type { ExamSession } from "../stores/examStoreType";

export function useChangeCategory() {
  const updateQuestionCategory = useExamStore((s) => s.updateQuestionCategory);
  const sessionId = useExamStore((s) => s.sessionId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      newCategoryId,
    }: {
      questionId: number;
      newCategoryId: number;
    }) => examApi.changeCategory(questionId, newCategoryId),
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
      queryClient.setQueryData<ExamSession>(
        ["exam-session", sessionId],
        (old) => {
          if (!old) return old;
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
        }
      );

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
