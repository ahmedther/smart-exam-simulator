import type { ExamState, ExamAction, Answer } from "../types/examStateTypes";

/**
 * Factory function to create initial exam state
 */
export const createInitialExamState = (): ExamState => ({
  currentQuestionIndex: 0,
  answers: new Map(),
  markedQuestions: new Set(),
  isPaused: false,
  questionStartTime: Date.now(),
  totalTimeSpent: 0,
  remainingTime: 0,
  pauseSource: null,
});

/**
 * Pure reducer function - handles all exam state transitions
 */
export function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "SELECT_ANSWER": {
      const existingAnswer = state.answers.get(action.questionId);
      const newAnswer: Answer = {
        questionId: action.questionId,
        selectedOptionId: action.optionId,
        timeSpent: existingAnswer?.timeSpent || 0,
        markedForReview: existingAnswer?.markedForReview || false,
        timestamp: new Date(),
      };

      const newAnswers = new Map(state.answers);
      newAnswers.set(action.questionId, newAnswer);

      return {
        ...state,
        answers: newAnswers,
        isPaused: false,
        pauseSource: null,
      };
    }

    case "NEXT_QUESTION": {
      const currentAnswer = state.answers.get(action.questionId);
      if (currentAnswer) {
        const updatedAnswer = {
          ...currentAnswer,
          timeSpent: currentAnswer.timeSpent + action.timeSpent,
        };
        const newAnswers = new Map(state.answers);
        newAnswers.set(action.questionId, updatedAnswer);

        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          answers: newAnswers,
          questionStartTime: Date.now(),
          totalTimeSpent: state.totalTimeSpent + action.timeSpent,
          isPaused: false,
          pauseSource: null,
        };
      }
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        questionStartTime: Date.now(),
        totalTimeSpent: state.totalTimeSpent + action.timeSpent,
        isPaused: false,
        pauseSource: null,
      };
    }

    case "PREVIOUS_QUESTION": {
      if (state.currentQuestionIndex === 0) return state;

      const currentAnswer = state.answers.get(action.questionId);
      if (currentAnswer) {
        const updatedAnswer = {
          ...currentAnswer,
          timeSpent: currentAnswer.timeSpent + action.timeSpent,
        };
        const newAnswers = new Map(state.answers);
        newAnswers.set(action.questionId, updatedAnswer);

        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex - 1,
          answers: newAnswers,
          questionStartTime: Date.now(),
          totalTimeSpent: state.totalTimeSpent + action.timeSpent,
          isPaused: false,
          pauseSource: null,
        };
      }
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
        questionStartTime: Date.now(),
        totalTimeSpent: state.totalTimeSpent + action.timeSpent,
        isPaused: false,
        pauseSource: null,
      };
    }

    case "TOGGLE_MARK": {
      const newMarked = new Set(state.markedQuestions);
      if (newMarked.has(action.questionId)) {
        newMarked.delete(action.questionId);
      } else {
        newMarked.add(action.questionId);
      }

      const currentAnswer = state.answers.get(action.questionId);
      if (currentAnswer) {
        const updatedAnswer = {
          ...currentAnswer,
          markedForReview: !currentAnswer.markedForReview,
        };
        const newAnswers = new Map(state.answers);
        newAnswers.set(action.questionId, updatedAnswer);
        return { ...state, markedQuestions: newMarked, answers: newAnswers };
      }

      return { ...state, markedQuestions: newMarked };
    }
    case "SET_PAUSE": {
      const newPaused =
        action.isPaused === "toggle" ? !state.isPaused : action.isPaused;

      // Don't override user pause with system
      if (state.pauseSource === "user" && action.source === "system") {
        return state;
      }

      return {
        ...state,
        isPaused: newPaused,
        pauseSource: newPaused ? action.source : null,
      };
    }
    case "NAVIGATE_TO": {
      return {
        ...state,
        currentQuestionIndex: action.questionNumber,
        questionStartTime: Date.now(),
        totalTimeSpent: state.totalTimeSpent + action.currentTimeSpent,
      };
    }

    case "SET_QUESTION": {
      const currentAnswer = state.answers.get(action.questionId);
      if (currentAnswer) {
        const updatedAnswer = {
          ...currentAnswer,
          timeSpent: currentAnswer.timeSpent + action.timeSpent,
        };
        const newAnswers = new Map(state.answers);
        newAnswers.set(action.questionId, updatedAnswer);

        return {
          ...state,
          currentQuestionIndex: action.index,
          answers: newAnswers,
          questionStartTime: Date.now(),
          totalTimeSpent: state.totalTimeSpent + action.timeSpent,
          isPaused: false,
          pauseSource: null,
        };
      }
      return {
        ...state,
        currentQuestionIndex: action.index,
        questionStartTime: Date.now(),
        totalTimeSpent: state.totalTimeSpent + action.timeSpent,
        isPaused: false,
        pauseSource: null,
      };
    }

    case "UPDATE_TIME": {
      return {
        ...state,
        totalTimeSpent: state.totalTimeSpent + action.timeSpent,
      };
    }

    case "UPDATE_TOTAL_TIME": {
      return {
        ...state,
        totalTimeSpent: state.totalTimeSpent + action.seconds,
      };
    }

    case "CLEAR_ANSWER": {
      const newAnswers = new Map(state.answers);
      newAnswers.delete(action.questionId);
      return { ...state, answers: newAnswers };
    }

    case "RESET_EXAM": {
      return createInitialExamState();
    }

    case "SUBMIT_EXAM": {
      return {
        ...state,
        totalTimeSpent: state.totalTimeSpent + action.finalTimeSpent,
        isPaused: true,
      };
    }
    case "DECREMENT_TIME": {
      const newTime = Math.max(0, state.remainingTime - 1);
      return {
        ...state,
        remainingTime: newTime,
        isPaused: newTime === 0 ? true : state.isPaused,
      };
    }
    case "RESTORE_STATE":
      return action.state;

    default:
      return state;
  }
}
