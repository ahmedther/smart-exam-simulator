import type { ExamAction, ExamState } from "./examTypes";

/**
 * Action creators - pure functions that create action objects
 * These make dispatching actions type-safe and consistent
 */
export const examActions = {
  /**
   * Select an answer for a question
   */
  selectAnswer: (questionId: string, optionId: string): ExamAction => ({
    type: "SELECT_ANSWER",
    questionId,
    optionId,
  }),

  /**
   * Move to the next question
   */
  nextQuestion: (questionId: string, timeSpent: number): ExamAction => ({
    type: "NEXT_QUESTION",
    questionId,
    timeSpent,
  }),

  /**
   * Move to the previous question
   */
  previousQuestion: (questionId: string, timeSpent: number): ExamAction => ({
    type: "PREVIOUS_QUESTION",
    questionId,
    timeSpent,
  }),

  /**
   * Toggle mark/flag on a question for review
   */
  toggleMark: (questionId: string): ExamAction => ({
    type: "TOGGLE_MARK",
    questionId,
  }),

  /**
   * Toggle pause state of the exam
   */
  togglePause: (): ExamAction => ({
    type: "TOGGLE_PAUSE",
  }),
  decrementTime: (): ExamAction => ({
    type: "DECREMENT_TIME",
  }),
  /**
   * Navigate to a specific question by number
   */
  navigateTo: (
    questionNumber: number,
    currentTimeSpent: number
  ): ExamAction => ({
    type: "NAVIGATE_TO",
    questionNumber,
    currentTimeSpent,
  }),

  /**
   * Set a specific question by index
   */
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

  /**
   * Update time spent on current question
   */
  updateTime: (timeSpent: number): ExamAction => ({
    type: "UPDATE_TIME",
    timeSpent,
  }),

  /**
   * Update total time spent on exam
   */
  updateTotalTime: (seconds: number): ExamAction => ({
    type: "UPDATE_TOTAL_TIME",
    seconds,
  }),

  /**
   * Clear/remove answer for a question
   */
  clearAnswer: (questionId: string): ExamAction => ({
    type: "CLEAR_ANSWER",
    questionId,
  }),

  /**
   * Reset exam to initial state
   */
  resetExam: (): ExamAction => ({
    type: "RESET_EXAM",
  }),

  /**
   * Submit the exam with final time
   */
  submitExam: (finalTimeSpent: number): ExamAction => ({
    type: "SUBMIT_EXAM",
    finalTimeSpent,
  }),

  /**
   * Restore exam state from saved data
   */
  restoreState: (state: ExamState): ExamAction => ({
    type: "RESTORE_STATE",
    state,
  }),
};
