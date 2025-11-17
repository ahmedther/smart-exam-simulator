// src/api/examApi.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function for API calls
async function apiFetch(endpoint, options = {}) {
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

  // const data = await response.json();
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  // data.has_active_session = true;
  // return data;

  return response.json();
}

// API Functions
export const examApi = {
  // Start a new exam session
  startExam: async (browserFingerprint) => {
    return apiFetch("/exam-sessions/start/", {
      method: "POST",
      body: JSON.stringify({
        browser_fingerprint: browserFingerprint || `browser-${Date.now()}`,
      }),
    });
  },

  // Check for active session
  checkActiveSession: async (browserFingerprint) => {
    return apiFetch("/exam-sessions/check-active/", {
      method: "POST",
      body: JSON.stringify({ browser_fingerprint: browserFingerprint }),
    });
  },

  // Resume session
  resumeSession: async (sessionId) => {
    return apiFetch(`/exam-sessions/${sessionId}/resume/`);
  },

  // Submit answer
  submitAnswer: async (questionId, userAnswer, timeSpent) => {
    return apiFetch(`/exam-questions/${questionId}/answer/`, {
      method: "PATCH",
      body: JSON.stringify({
        user_answer: userAnswer,
        time_spent: timeSpent,
      }),
    });
  },

  // Toggle mark for review
  toggleMark: async (questionId) => {
    return apiFetch(`/exam-questions/${questionId}/toggle-mark/`, {
      method: "PATCH",
    });
  },

  // Auto-save progress
  autosave: async (sessionId, totalTimeSpent, currentQuestionNumber) => {
    return apiFetch(`/exam-sessions/${sessionId}/autosave/`, {
      method: "PATCH",
      body: JSON.stringify({
        total_time_spent: totalTimeSpent,
        current_question_number: currentQuestionNumber,
      }),
    });
  },

  // Submit exam
  submitExam: async (sessionId, totalTimeSpent) => {
    return apiFetch(`/exam-sessions/${sessionId}/submit/`, {
      method: "POST",
      body: JSON.stringify({ total_time_spent: totalTimeSpent }),
    });
  },

  // Get categories
  getCategories: async () => {
    return apiFetch("/categories/");
  },
};
