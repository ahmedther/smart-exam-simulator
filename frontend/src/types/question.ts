export interface Question {
  id: number;
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
