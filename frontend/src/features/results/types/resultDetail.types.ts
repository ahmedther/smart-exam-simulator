export interface AnswersBreakdown {
  total: number;
  answered: number;
  skipped: number;
  correct: number;
  incorrect: number;
}

/**
 * Category-wise performance details
 */
export interface CategoryPerformance {
  category_id: number;
  name: string;
  accuracy: number;
  correct: number;
  incorrect: number;
  skipped: number;
  total_time: number;
  avg_time_per_question: number;
}

/**
 * Insight/recommendation object
 */
export interface Insight {
  type:
    | "weak_categories"
    | "unanswered_questions"
    | "time_pressure"
    | "needs_study"
    | "needs_improvement"
    | "excellent";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
}

/**
 * Individual question review details
 */
export interface QuestionReview {
  question_number: number;
  question_text: string;
  category: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  user_answer: "a" | "b" | "c" | "d" | null;
  correct_answer: "a" | "b" | "c" | "d";
  is_correct: boolean | null;
  explanation: string;
  time_spent: number;
}

/**
 * Submission details
 */
export interface Submission {
  type: "manual" | "timeout";
  time_utilized: number; // in seconds
  time_available: number; // in seconds
  time_utilization_percent: number;
}

/**
 * Complete exam results detail response
 * This is what the Django API returns for GET /api/results/{session_id}/
 */
export interface ExamResultsDetail {
  // Basic info
  session_id: string;
  completed_at: string; // ISO 8601 datetime string

  // Scores
  scaled_score: number; // 200-800
  percentage: number; // 0-100
  passing_score: number;
  passed: boolean;
  status: "Passed" | "Failed";
  performance_level:
    | "Excellent"
    | "Very Good"
    | "Pass"
    | "Supervised Practice Level"
    | "Below Passing";

  // Timing
  total_time_spent: number; // in seconds
  exam_duration: number; // in seconds
  average_time_per_question: number; // in seconds

  // Detailed analytics
  submission: Submission;
  answers: AnswersBreakdown;
  category_performance: CategoryPerformance[];
  insights: Insight[];
  questions: QuestionReview[];
}
