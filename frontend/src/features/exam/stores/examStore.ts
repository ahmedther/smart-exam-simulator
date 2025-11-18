import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  createInitialExamState,
  examReducer,
  type ExamAction,
  type ExamState,
} from "../reducers";
import type { ExamStore } from "./examStoreType";

export const useExamStore = create<ExamStore>()(
  devtools(
    (set, get) => ({
      state: createInitialExamState(),
      sessionId: "",
      questions: [],

      dispatch: (action: ExamAction) =>
        set((store: { state: ExamState }) => ({
          state: examReducer(store.state, action),
        })),

      initialize: (sessionId, questions) => set({ sessionId, questions }),

      getCurrentQuestion: () => {
        const { state, questions } = get();
        return questions[state.currentQuestionIndex];
      },

      getCurrentAnswer: () => {
        const { state } = get();
        const currentQuestion = get().getCurrentQuestion();
        if (!currentQuestion) return undefined;
        return state.answers.get(String(currentQuestion.id));
      },

      isCurrentMarked: () => {
        const { state } = get();
        const currentQuestion = get().getCurrentQuestion();
        if (!currentQuestion) return false;
        return state.markedQuestions.has(String(currentQuestion.id));
      },

      getStatistics: () => {
        const { state, questions } = get();
        return {
          totalQuestions: questions.length,
          answeredQuestions: state.answers.size,
          markedQuestions: state.markedQuestions.size,
          unansweredQuestions: questions.length - state.answers.size,
          progress:
            questions.length > 0
              ? (state.answers.size / questions.length) * 100
              : 0,
        };
      },
    }),
    { name: "ExamStore" }
  )
);
