import { useCallback, useRef } from "react";
import { useExamStore } from "../stores/examStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examActions, type ExamState } from "../reducers";

export function useExamActions() {
  const dispatch = useExamStore((s) => s.dispatch);
  const getCurrentQuestion = useExamStore((s) => s.getCurrentQuestion);
  const isPaused = useExamStore((s) => s.state.isPaused);
  const sessionId = useExamStore((s) => s.sessionId);
  const state = useExamStore((s) => s.state);

  const questionStartTimeRef = useRef(Date.now());
  const queryClient = useQueryClient();

  // Calculate time spent on current question
  const getTimeSpent = useCallback(() => {
    if (isPaused) return 0;
    return Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
  }, [isPaused]);

  // Auto-save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { sessionId: string; state: ExamState }) => {
      const serializedAnswers = Array.from(data.state.answers.entries()).map(
        ([id, answer]) => ({ id, ...answer })
      );
      const serializedMarked = Array.from(data.state.markedQuestions);

      return fetch(`/api/exam/save-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: data.sessionId,
          currentQuestionIndex: data.state.currentQuestionIndex,
          answers: serializedAnswers,
          markedQuestions: serializedMarked,
          totalTimeSpent: data.state.totalTimeSpent,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-session", sessionId] });
    },
  });

  // Actions - same as your original but using Zustand dispatch
  const actions = {
    selectAnswer: useCallback(
      (optionId: string) => {
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) return;
        dispatch(
          examActions.selectAnswer(String(currentQuestion.id), optionId)
        );
      },
      [dispatch, getCurrentQuestion]
    ),

    nextQuestion: useCallback(() => {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;
      const timeSpent = getTimeSpent();
      dispatch(examActions.nextQuestion(String(currentQuestion.id), timeSpent));
      questionStartTimeRef.current = Date.now();
    }, [dispatch, getCurrentQuestion, getTimeSpent]),

    previousQuestion: useCallback(() => {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;
      const timeSpent = getTimeSpent();
      dispatch(
        examActions.previousQuestion(String(currentQuestion.id), timeSpent)
      );
      questionStartTimeRef.current = Date.now();
    }, [dispatch, getCurrentQuestion, getTimeSpent]),

    toggleMark: useCallback(() => {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;
      dispatch(examActions.toggleMark(String(currentQuestion.id)));
    }, [dispatch, getCurrentQuestion]),

    togglePause: useCallback(() => {
      dispatch(examActions.togglePause());
    }, [dispatch]),

    goToQuestion: useCallback(
      (index: number) => {
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) return;
        const timeSpent = getTimeSpent();
        dispatch(
          examActions.setQuestion(index, String(currentQuestion.id), timeSpent)
        );
        questionStartTimeRef.current = Date.now();
      },
      [dispatch, getCurrentQuestion, getTimeSpent]
    ),

    navigateTo: useCallback(
      (questionNumber: number) => {
        const timeSpent = getTimeSpent();
        dispatch(examActions.navigateTo(questionNumber, timeSpent));
        questionStartTimeRef.current = Date.now();
      },
      [dispatch, getTimeSpent]
    ),

    clearAnswer: useCallback(() => {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;
      dispatch(examActions.clearAnswer(String(currentQuestion.id)));
    }, [dispatch, getCurrentQuestion]),

    resetExam: useCallback(() => {
      dispatch(examActions.resetExam());
      questionStartTimeRef.current = Date.now();
    }, [dispatch]),

    submitExam: useCallback(() => {
      const finalTimeSpent = getTimeSpent();
      dispatch(examActions.submitExam(finalTimeSpent));
    }, [dispatch, getTimeSpent]),

    restoreState: useCallback(
      (restoredState: ExamState) => {
        dispatch(examActions.restoreState(restoredState));
        questionStartTimeRef.current = Date.now();
      },
      [dispatch]
    ),

    saveProgress: useCallback(() => {
      saveMutation.mutate({ sessionId, state });
    }, [sessionId, state, saveMutation]),
  };

  return {
    actions,
    isSaving: saveMutation.isPending,
  };
}
