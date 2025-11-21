/**
 * Represents a single answer in the exam
 */
export interface Answer {
  questionId: string;
  selectedOptionId: string;
  timeSpent: number; // in seconds
  markedForReview: boolean;
  timestamp: Date;
}

/**
 * The complete state of an exam session
 */
export interface ExamState {
  pauseSource: "user" | "system" | null;
  currentQuestionIndex: number;
  answers: Map<string, Answer>;
  markedQuestions: Set<string>;
  isPaused: boolean;
  questionStartTime: number;
  totalTimeSpent: number;
  remainingTime: number;
}

/**
 * All possible actions that can modify exam state
 */
export type ExamAction =
  | { type: "SELECT_ANSWER"; questionId: string; optionId: string }
  | { type: "NEXT_QUESTION"; questionId: string; timeSpent: number }
  | { type: "PREVIOUS_QUESTION"; questionId: string; timeSpent: number }
  | { type: "TOGGLE_MARK"; questionId: string }
  | {
      type: "SET_PAUSE";
      isPaused: boolean | "toggle";
      source: "user" | "system";
    }
  | { type: "NAVIGATE_TO"; questionNumber: number; currentTimeSpent: number }
  | {
      type: "SET_QUESTION";
      index: number;
      questionId: string;
      timeSpent: number;
    }
  | { type: "UPDATE_TIME"; timeSpent: number }
  | { type: "UPDATE_TOTAL_TIME"; seconds: number }
  | { type: "DECREMENT_TIME" }
  | { type: "CLEAR_ANSWER"; questionId: string }
  | { type: "RESET_EXAM" }
  | { type: "SUBMIT_EXAM"; finalTimeSpent: number }
  | { type: "RESTORE_STATE"; state: ExamState };
