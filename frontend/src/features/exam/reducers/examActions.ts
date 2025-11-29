import type { ExamAction } from "../types";

export const examActions = {
  selectAnswer: (questionId: string, optionId: string): ExamAction => ({
    type: "SELECT_ANSWER",
    questionId,
    optionId,
  }),

  nextQuestion: (questionId: string, timeSpent: number): ExamAction => ({
    type: "NEXT_QUESTION",
    questionId,
    timeSpent,
  }),

  previousQuestion: (questionId: string, timeSpent: number): ExamAction => ({
    type: "PREVIOUS_QUESTION",
    questionId,
    timeSpent,
  }),

  toggleMark: (questionId: string): ExamAction => ({
    type: "TOGGLE_MARK",
    questionId,
  }),

  setPause: (
    paused: boolean | "toggle",
    source: "user" | "system" = "user",
    currentQuestionId?: string
  ): ExamAction => ({
    type: "SET_PAUSE",
    paused,
    source,
    currentQuestionId,
  }),

  setQuestion: (
    index: number,
    questionId: string,
    timeSpent: number
  ): ExamAction => ({
    type: "SET_QUESTION",
    index,
    questionId,
    timeSpent,
  }),

  clearAnswer: (questionId: string): ExamAction => ({
    type: "CLEAR_ANSWER",
    questionId,
  }),

  decrementTime: (): ExamAction => ({
    type: "DECREMENT_TIME",
  }),
  // NEW: Action for snapshot updates
  updateSnapshot: (snapshot: string): ExamAction => ({
    type: "UPDATE_SNAPSHOT",
    snapshot,
  }),
};
