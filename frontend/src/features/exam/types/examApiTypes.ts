import type { Answer } from "./examStateTypes";
import type { Session } from "./examStoreType";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type ChangeCategoryResponse = {
  message: string;
  question_id: number;
  old_category: string;
  new_category: string;
  new_category_id: number;
};

export interface Category {
  id: number;
  name: string;
  description: string;
  question_count: number;
  created_at: string;
}

export type CheckActiveSessionResponse = {
  has_active_session: boolean;
  session_id?: string;
  session?: Session;
};

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}
export interface AutoSaveInput {
  currentQuestionIndex: number;
  totalTimeSpent: number;
  answers: Map<string, Answer>;
  markedQuestions: Set<string>;
}

export interface ExamProgressPayload {
  total_time_spent: number;
  current_question_number: number;
  answers: Array<{
    question_id: string;
    user_answer: string | null;
    time_spent: number;
    marked_for_review: boolean;
  }>;
}
