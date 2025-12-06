type ExamResultTypes = {
  session_id: string;
  scaled_score: number;
  performance_level: string;
  accuracy: number;
  status: string;
  date: string;
  total_time: string;
  questions_summary: string;
  average_time: number;
  passing_score: number;
  passed: boolean;
  percentage: number;
  total_questions: number;
};

type ResultsStatsTypes = {
  passed: number;
  failed: number;
  pass_rate: number;
};

type PaginatedResultsTypes = {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  results: ExamResultTypes[];
  stats: ResultsStatsTypes;
};

type ResultsSearchTypes = {
  page: number;
  search: string;
  sort: string;
};

type ThemeClassesTypes = {
  container: string;
  header: string;
  title: string;
  subtitle: string;
  searchInput: string;
  card: string;
  cardLabel: string;
  cardValue: string;
  cardMeta: string;
  pagination: string;
  paginationActive: string;
  icon: string;
  iconText: string;
};

export type {
  PaginatedResultsTypes,
  ExamResultTypes,
  ResultsStatsTypes,
  ResultsSearchTypes,
  ThemeClassesTypes,
};
