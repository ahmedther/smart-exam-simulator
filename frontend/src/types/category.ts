export interface Category {
  id: number;
  name: string;
  description: string;
  question_count: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

