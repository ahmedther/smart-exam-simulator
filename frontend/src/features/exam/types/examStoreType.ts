import type { Answer, ExamAction, ExamState } from "./examStateTypes";

interface Question {
  id: number;
  question_id: number;
  question_number: number;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  category_id: number;
  category_name: string;
  user_answer: string | null;
  time_spent: number;
  marked_for_review: boolean;
  answered_at: string | null;
}

interface Session {
  session_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_time_spent: number;
  exam_duration: number;
  remaining_time: number;
  current_question_number: number;
  total_questions: number;
  score: number | null;
  correct_answers: number;
  progress_percentage: number;
}
interface ExamSession {
  session: Session;
  questions: Question[];
}

interface ExamStore {
  decrementTime: () => void;
  // Core state
  state: ExamState;
  sessionId: string;
  session: Session | null;
  questions: Question[];

  // Dispatch for reducer
  dispatch: (action: ExamAction) => void;

  // Initialize store with API data
  initialize: (data: { session: Session; questions: Question[] }) => void;

  // Computed values
  getCurrentQuestion: () => Question | undefined;
  getCurrentAnswer: () => Answer | undefined;
  isCurrentMarked: () => boolean;

  updateQuestionCategory: (
    questionId: number,
    categoryId: number,
    categoryName: string
  ) => void;

  // Helper to update statistics
  // High-level actions (these use the reducer internally)
  selectAnswer: (optionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  toggleMark: () => void;
  togglePause: () => void;
  pauseForActivity: () => void;
  resumeFromActivity: () => void;
  goToQuestion: (index: number) => void;
  clearAnswer: () => void;
  submitExam: () => void;
}

export type { ExamStore, Question, Session, ExamSession };
