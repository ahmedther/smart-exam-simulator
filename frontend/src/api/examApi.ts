import type {
  Category,
  ChangeCategoryResponse,
  CheckActiveSessionResponse,
  ExamProgressPayload,
  ExamSession,
  PaginatedResponse,
} from "../features/exam/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "An error occurred" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// const data = await response.json();
// await new Promise((resolve) => setTimeout(resolve, 2000));
// data.has_active_session = true;
// console.log("first");
// console.log(data);
// return data;

// API Functions

export const examApi = {
  startExam: async (browserFingerprint: string) => {
    return apiFetch<ExamSession>("/exam-sessions/start/", {
      method: "POST",
      body: JSON.stringify({
        browser_fingerprint: browserFingerprint || `browser-${Date.now()}`,
      }),
    });
  },

  // Check for active session
  checkActiveSession: async (browserFingerprint: string) => {
    return apiFetch<CheckActiveSessionResponse>(
      "/exam-sessions/check-active/",
      {
        method: "POST",
        body: JSON.stringify({ browser_fingerprint: browserFingerprint }),
      }
    );
  },

  // Resume session
  resumeSession: async (sessionId: string) => {
    return apiFetch(`/exam-sessions/${sessionId}/resume/`);
  },

  changeCategory: async (questionId: number, newCategoryId: number) => {
    return apiFetch<ChangeCategoryResponse>("/questions/update-category/", {
      method: "PATCH",
      body: JSON.stringify({
        question_id: questionId,
        new_category_id: newCategoryId,
      }),
    });
  },
  // Submit answer
  submitAnswer: async (
    questionId: number,
    userAnswer: string,
    timeSpent: number
  ) => {
    return apiFetch(`/exam-questions/${questionId}/answer/`, {
      method: "PATCH",
      body: JSON.stringify({
        user_answer: userAnswer,
        time_spent: timeSpent,
      }),
    });
  },

  // Toggle mark for review
  toggleMark: async (questionId: number) => {
    return apiFetch(`/exam-questions/${questionId}/toggle-mark/`, {
      method: "PATCH",
    });
  },

  autoSave: async (sessionId: string, payload: ExamProgressPayload) => {
    return apiFetch(`/exam-sessions/${sessionId}/autosave/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // Submit exam
  submitExam: async (sessionId: string, payload: ExamProgressPayload) => {
    return apiFetch(`/exam-sessions/${sessionId}/submit/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Get categories
  getCategories: async () => {
    return apiFetch<PaginatedResponse<Category>>("/categories/");
  },
};
