import type { ExamProgressPayload } from "./examApiTypes";
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
  first_viewed_at: string | null;
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

  // High-level actions
  selectAnswer: (optionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  toggleMark: () => void;
  togglePause: () => void;
  pauseForActivity: () => void;
  resumeFromActivity: () => void;
  goToQuestion: (index: number) => void;
  clearAnswer: () => void;
  decrementTime: () => void;
  updateQuestionCategory: (
    questionId: number,
    categoryId: number,
    categoryName: string
  ) => void;

  // Payload builder methods (used by hooks)
  getPayloadBuilderInput: () => {
    sessionId: string;
    currentQuestionIndex: number;
    answers: Map<string, Answer>;
    markedQuestions: Set<string>;
    remainingTime: number;
    examDuration: number;
  };
  getExamProgressPayload: () => ExamProgressPayload;
  getCurrentSnapshot: () => string;
  hasDataChanged: () => boolean;
  updateSnapshot: () => void;
  reset: () => void;
}
export type { ExamStore, Question, Session, ExamSession };
