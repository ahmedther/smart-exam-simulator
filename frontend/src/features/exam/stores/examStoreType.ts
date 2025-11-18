/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExamAction, ExamState } from "../reducers";

interface ExamStore {
  // State from your reducer
  state: ExamState;

  // Session info
  sessionId: string;
  questions: any[];

  // Dispatch action to reducer
  dispatch: (action: ExamAction) => void;

  // Initialize store with session data
  initialize: (sessionId: string, questions: any[]) => void;

  // Helper to get current question
  getCurrentQuestion: () => any;

  // Helper to get current answer
  getCurrentAnswer: () => any;

  // Helper to check if current question is marked
  isCurrentMarked: () => boolean;

  // Statistics
  getStatistics: () => {
    totalQuestions: number;
    answeredQuestions: number;
    markedQuestions: number;
    unansweredQuestions: number;
    progress: number;
  };
}

export type { ExamStore };
