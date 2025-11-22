import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createInitialExamState, examActions, examReducer } from "../reducers";
import type { ExamStore } from "../types/examStoreType";
import { toast } from "../../../utils";
import type { Answer, ExamAction } from "../types";

export const useExamStore = create<ExamStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        state: createInitialExamState(),
        sessionId: "",
        session: null,
        questions: [],

        // Dispatch action to reducer
        dispatch: (action: ExamAction) => {
          set((store) => ({
            state: examReducer(store.state, action),
          }));
          // ✅ Recalculate statistics after state changes
        },

        // ✅ Initialize store with API data
        initialize: (data) => {
          const { session, questions } = data;

          // Restore any existing answers from server
          const answers = new Map<string, Answer>();
          const markedQuestions = new Set<string>();
          questions.forEach((q) => {
            if (q.user_answer) {
              answers.set(String(q.id), {
                questionId: String(q.id),
                selectedOptionId: q.user_answer,
                timeSpent: q.time_spent,
                markedForReview: q.marked_for_review,
                timestamp: q.answered_at ? new Date(q.answered_at) : new Date(),
              });
            }
            if (q.marked_for_review) {
              markedQuestions.add(String(q.id));
            }
          });

          set({
            sessionId: session.session_id,
            session,
            questions,
            state: {
              currentQuestionIndex: session.current_question_number - 1, // Convert to 0-based
              answers,
              markedQuestions,
              isPaused: false,
              questionStartTime: Date.now(),
              totalTimeSpent: session.total_time_spent,
              remainingTime: session.remaining_time,
              pauseSource: null,
              // remainingTime: 5,
            },
          });
        },

        // Computed values
        getCurrentQuestion: () => {
          const { state, questions } = get();
          return questions[state.currentQuestionIndex];
        },

        getCurrentAnswer: () => {
          const { state } = get();
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return undefined;
          return state.answers.get(String(currentQuestion.id));
        },

        isCurrentMarked: () => {
          const { state } = get();
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return false;
          return state.markedQuestions.has(String(currentQuestion.id));
        },

        // ✅ High-level actions that use the reducer
        selectAnswer: (optionId: string) => {
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return;
          get().dispatch(
            examActions.selectAnswer(String(currentQuestion.id), optionId)
          );
        },

        nextQuestion: () => {
          const { state, questions } = get();
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return;

          // Don't go past last question
          if (state.currentQuestionIndex >= questions.length - 1) return;

          const timeSpent = state.isPaused
            ? 0
            : Math.floor((Date.now() - state.questionStartTime) / 1000);

          get().dispatch(
            examActions.nextQuestion(String(currentQuestion.id), timeSpent)
          );
        },

        previousQuestion: () => {
          const { state } = get();
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return;

          // Don't go before first question
          if (state.currentQuestionIndex === 0) return;

          const timeSpent = state.isPaused
            ? 0
            : Math.floor((Date.now() - state.questionStartTime) / 1000);

          get().dispatch(
            examActions.previousQuestion(String(currentQuestion.id), timeSpent)
          );
        },

        toggleMark: () => {
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return;
          get().dispatch(examActions.toggleMark(String(currentQuestion.id)));
        },

        togglePause: () => {
          get().dispatch(examActions.setPause("toggle", "user"));
        },

        pauseForActivity: () => {
          get().dispatch(examActions.setPause(true, "system"));
        },

        resumeFromActivity: () => {
          get().dispatch(examActions.setPause(false, "system"));
        },
        decrementTime: () => {
          get().dispatch(examActions.decrementTime());

          // if (newTime <= 0) {
          //   // NOW we use the generic dispatch because submitting DOES affect statistics/state
          //   get().dispatch(examActions.submitExam());
          //   toast.warning("Time expired! Auto-submitting...");
          // }
          const remaining = get().state.remainingTime;
          if (remaining === 600) toast.info("10 minutes left!");
          if (remaining === 300) toast.info("5 minutes left!");
          if (remaining === 60) toast.warning("1 minute left!");
          if (remaining === 3)
            toast.warning("Time expired! Auto-submitting score...");
        },

        goToQuestion: (index: number) => {
          const { state, questions } = get();
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return;

          // Validate index
          if (index < 0 || index >= questions.length) return;

          const timeSpent = state.isPaused
            ? 0
            : Math.floor((Date.now() - state.questionStartTime) / 1000);

          get().dispatch(
            examActions.setQuestion(
              index,
              String(currentQuestion.id),
              timeSpent
            )
          );
        },

        clearAnswer: () => {
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return;
          get().dispatch(examActions.clearAnswer(String(currentQuestion.id)));
        },

        submitExam: () => {
          const { state } = get();
          const timeSpent = state.isPaused
            ? 0
            : Math.floor((Date.now() - state.questionStartTime) / 1000);

          get().dispatch(examActions.submitExam(timeSpent));
        },

        updateQuestionCategory: (
          questionId: number,
          categoryId: number,
          categoryName: string
        ) =>
          set((state) => ({
            questions: state.questions.map((q) =>
              q.question_id === questionId
                ? { ...q, category_id: categoryId, category_name: categoryName }
                : q
            ),
          })),

        // getStatistics: () => {
        //   const { questions, state } = get();
        //   const answeredCount = state.answers.size;
        //   const markedCount = state.markedQuestions.size;

        //   return {
        //     totalQuestions: questions.length,
        //     answeredQuestions: answeredCount,
        //     markedQuestions: markedCount,
        //     unansweredQuestions: questions.length - answeredCount,
        //     progress:
        //       questions.length > 0
        //         ? Math.round((answeredCount / questions.length) * 100)
        //         : 0,
        //   };
        // },
      }),
      {
        name: "exam-storage",
        // Only persist essential data
        partialize: (state) => ({
          sessionId: state.sessionId,
          state: {
            currentQuestionIndex: state.state.currentQuestionIndex,
            answers: Array.from(state.state.answers.entries()),
            markedQuestions: Array.from(state.state.markedQuestions),
            totalTimeSpent: state.state.totalTimeSpent,
            remainingTime: state.state.remainingTime,
          },
        }),
      }
    ),
    { name: "ExamStore" }
  )
);
