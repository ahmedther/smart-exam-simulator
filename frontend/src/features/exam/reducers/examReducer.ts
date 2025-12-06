import type { Answer, ExamAction, ExamState } from "../types";

export const createInitialExamState = (): ExamState => {
  return {
    currentQuestionIndex: 0,
    answers: new Map(),
    markedQuestions: new Set(),
    isPaused: false,
    questionStartTime: Date.now(),
    totalTimeSpent: 0,
    remainingTime: -1,
    pauseSource: null,
    lastSavedSnapshot: undefined,
  };
};

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
      const newAnswers = new Map(state.answers);

      if (currentAnswer) {
        newAnswers.set(action.questionId, {
          ...currentAnswer,
          timeSpent: currentAnswer.timeSpent + action.timeSpent,
        });
      } else {
        newAnswers.set(action.questionId, {
          questionId: action.questionId,
          selectedOptionId: null,
          timeSpent: action.timeSpent,
          markedForReview: false,
          timestamp: new Date(),
        });
      }

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

    case "PREVIOUS_QUESTION": {
      if (state.currentQuestionIndex === 0) return state;

      const currentAnswer = state.answers.get(action.questionId);
      const newAnswers = new Map(state.answers);

      if (currentAnswer) {
        newAnswers.set(action.questionId, {
          ...currentAnswer,
          timeSpent: currentAnswer.timeSpent + action.timeSpent,
        });
      } else {
        newAnswers.set(action.questionId, {
          questionId: action.questionId,
          selectedOptionId: null,
          timeSpent: action.timeSpent,
          markedForReview: false,
          timestamp: new Date(),
        });
      }

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

    case "TOGGLE_MARK": {
      const newMarked = new Set(state.markedQuestions);
      if (newMarked.has(action.questionId)) {
        newMarked.delete(action.questionId);
      } else {
        newMarked.add(action.questionId);
      }

      const currentAnswer = state.answers.get(action.questionId);
      if (currentAnswer) {
        const newAnswers = new Map(state.answers);
        newAnswers.set(action.questionId, {
          ...currentAnswer,
          markedForReview: !currentAnswer.markedForReview,
        });
        return { ...state, markedQuestions: newMarked, answers: newAnswers };
      }

      return { ...state, markedQuestions: newMarked };
    }

    case "SET_PAUSE": {
      const shouldPause =
        action.paused === "toggle" ? !state.isPaused : action.paused;

      if (shouldPause && !state.isPaused && action.currentQuestionId) {
        const timeSpent = Math.floor(
          (Date.now() - state.questionStartTime) / 1000
        );
        const currentAnswer = state.answers.get(action.currentQuestionId);
        const newAnswers = new Map(state.answers);

        if (currentAnswer) {
          newAnswers.set(action.currentQuestionId, {
            ...currentAnswer,
            timeSpent: currentAnswer.timeSpent + timeSpent,
          });
        } else if (timeSpent > 0) {
          newAnswers.set(action.currentQuestionId, {
            questionId: action.currentQuestionId,
            selectedOptionId: null,
            timeSpent: timeSpent,
            markedForReview: false,
            timestamp: new Date(),
          });
        }

        return {
          ...state,
          isPaused: true,
          pauseSource: action.source,
          answers: newAnswers,
          totalTimeSpent: state.totalTimeSpent + timeSpent,
          questionStartTime: Date.now(),
        };
      } else if (!shouldPause && state.isPaused) {
        if (action.source === "system" && state.pauseSource !== "system") {
          return state;
        }

        return {
          ...state,
          isPaused: false,
          pauseSource: null,
          questionStartTime: Date.now(),
        };
      }

      return state;
    }

    case "SET_QUESTION": {
      const currentAnswer = state.answers.get(action.questionId);
      const newAnswers = new Map(state.answers);

      if (currentAnswer) {
        newAnswers.set(action.questionId, {
          ...currentAnswer,
          timeSpent: currentAnswer.timeSpent + action.timeSpent,
        });
      } else if (action.timeSpent > 0) {
        newAnswers.set(action.questionId, {
          questionId: action.questionId,
          selectedOptionId: null,
          timeSpent: action.timeSpent,
          markedForReview: false,
          timestamp: new Date(),
        });
      }

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

    case "CLEAR_ANSWER": {
      const newAnswers = new Map(state.answers);
      newAnswers.delete(action.questionId);
      return { ...state, answers: newAnswers };
    }

    case "DECREMENT_TIME": {
      const newTime = Math.max(0, state.remainingTime - 1);
      return {
        ...state,
        remainingTime: newTime,
        isPaused: newTime === 0 ? true : state.isPaused,
      };
    }

    case "UPDATE_SNAPSHOT": {
      return {
        ...state,
        lastSavedSnapshot: action.snapshot,
      };
    }

    default:
      return state;
  }
}
