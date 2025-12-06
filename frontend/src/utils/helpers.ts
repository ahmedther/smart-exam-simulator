import type { ExamResultTypes } from "../features/results/types";

const getBrowserFingerprint = () => {
  const stored = localStorage.getItem("browser_fingerprint");
  if (stored) return stored;

  const fingerprint = `browser-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  localStorage.setItem("browser_fingerprint", fingerprint);
  return fingerprint;
};

// Calculate question margin from passing threshold
// Passing score is 500 which corresponds to 70% (157.5 questions out of 225)
// Formula: reverse the scaling to get raw percentage, then calculate question difference
const calculateQuestionMargin = (result: ExamResultTypes) => {
  const currentScore = result.scaled_score;

  // Reverse engineer the percentage from scaled score
  let currentPercentage: number;
  if (currentScore >= 500) {
    // Above passing: 500-800 → 70%-100%
    currentPercentage = 70 + ((currentScore - 500) / 300) * 30;
  } else {
    // Below passing: 200-500 → 0%-70%
    currentPercentage = ((currentScore - 200) / 300) * 70;
  }

  // Passing threshold is 70%
  const passingPercentage = 70;

  // Calculate questions: 225 total questions
  const totalQuestions = result.total_questions || 225;
  const currentQuestions = Math.round(
    (currentPercentage / 100) * totalQuestions
  );
  const passingQuestions = Math.round(
    (passingPercentage / 100) * totalQuestions
  );

  return currentQuestions - passingQuestions;
};

export { getBrowserFingerprint, calculateQuestionMargin };
