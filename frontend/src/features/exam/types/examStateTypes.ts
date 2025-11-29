export interface Answer {
  questionId: string;
  selectedOptionId: string | null;
  timeSpent: number; // in seconds
  markedForReview: boolean;
  timestamp: Date;
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: Map<string, Answer>;
  markedQuestions: Set<string>;
  isPaused: boolean;
  questionStartTime: number;
  totalTimeSpent: number;
  remainingTime: number;
  pauseSource: "user" | "system" | null;
  lastSavedSnapshot?: string | null;
}

export type ExamAction =
  | { type: "SELECT_ANSWER"; questionId: string; optionId: string }
  | { type: "NEXT_QUESTION"; questionId: string; timeSpent: number }
  | { type: "PREVIOUS_QUESTION"; questionId: string; timeSpent: number }
  | { type: "TOGGLE_MARK"; questionId: string }
  | {
      type: "SET_PAUSE";
      paused: boolean | "toggle";
      source: "user" | "system";
      currentQuestionId?: string;
    } // ✅ Changed
  | {
      type: "SET_QUESTION";
      index: number;
      questionId: string;
      timeSpent: number;
    }
  | { type: "CLEAR_ANSWER"; questionId: string }
  | { type: "SUBMIT_EXAM"; finalTimeSpent: number }
  | { type: "DECREMENT_TIME" }
  | { type: "UPDATE_SNAPSHOT"; snapshot: string };
