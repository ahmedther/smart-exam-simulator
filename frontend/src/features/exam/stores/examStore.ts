import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ExamStore } from "../types/examStoreType";
import { toast } from "../../../utils";
import type { Answer, ExamAction } from "../types";
import { createInitialExamState, examActions, examReducer } from "../reducers";
import { ExamPayloadBuilder } from "../utils";

export const useExamStore = create<ExamStore>()(
  devtools(
    persist(
      (set, get) => ({
        state: createInitialExamState(),
        sessionId: "",
        session: null,
        questions: [],

        dispatch: (action: ExamAction) => {
          set((store) => ({
            state: examReducer(store.state, action),
          }));
        },

        initialize: (data) => {
          const { session, questions } = data;
          if (!session || !session.session_id) {
            throw new Error("Invalid session data");
          }

          const answers = new Map<string, Answer>();
          const markedQuestions = new Set<string>();

          questions.forEach((q) => {
            if (q.first_viewed_at || q.user_answer) {
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
              currentQuestionIndex: session.current_question_number - 1,
              answers,
              markedQuestions,
              isPaused: false,
              questionStartTime: Date.now(),
              totalTimeSpent: session.total_time_spent,
              remainingTime: session.remaining_time,
              pauseSource: null,
            },
          });
        },

        getCurrentQuestion: () => {
          const { state, questions } = get();
          return questions[state.currentQuestionIndex];
        },

        getCurrentAnswer: () => {
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return undefined;
          return get().state.answers.get(String(currentQuestion.id));
        },

        isCurrentMarked: () => {
          const currentQuestion = get().getCurrentQuestion();
          if (!currentQuestion) return false;
          return get().state.markedQuestions.has(String(currentQuestion.id));
        },

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
          if (
            !currentQuestion ||
            state.currentQuestionIndex >= questions.length - 1
          )
            return;

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
          if (!currentQuestion || state.currentQuestionIndex === 0) return;

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
          const currentQuestion = get().getCurrentQuestion();
          get().dispatch(
            examActions.setPause(
              "toggle",
              "user",
              currentQuestion ? String(currentQuestion.id) : undefined
            )
          );
        },

        pauseForActivity: () => {
          const currentQuestion = get().getCurrentQuestion();
          get().dispatch(
            examActions.setPause(
              true,
              "system",
              currentQuestion ? String(currentQuestion.id) : undefined
            )
          );
        },

        resumeFromActivity: () => {
          get().dispatch(examActions.setPause(false, "system"));
        },

        decrementTime: () => {
          get().dispatch(examActions.decrementTime());

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
          if (!currentQuestion || index < 0 || index >= questions.length)
            return;

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

        getPayloadBuilderInput: () => {
          const { sessionId, state, session } = get();
          return {
            sessionId,
            currentQuestionIndex: state.currentQuestionIndex,
            remainingTime: state.remainingTime,
            examDuration: session?.exam_duration ?? 0,
            answers: state.answers,
            markedQuestions: state.markedQuestions,
          };
        },

        // NEW: Get auto-save payload
        getExamProgressPayload: () => {
          const input = get().getPayloadBuilderInput();
          return ExamPayloadBuilder.buildExamProgressPayload(input);
        },

        // NEW: Get current snapshot
        getCurrentSnapshot: () => {
          const input = get().getPayloadBuilderInput();
          return ExamPayloadBuilder.createSnapshot(input);
        },

        // NEW: Check if data has changed since last save
        hasDataChanged: () => {
          const currentSnapshot = get().getCurrentSnapshot();
          const lastSnapshot = get().state.lastSavedSnapshot;
          return currentSnapshot !== lastSnapshot;
        },

        // NEW: Update snapshot after successful save
        updateSnapshot: () => {
          const snapshot = get().getCurrentSnapshot();
          get().dispatch({ type: "UPDATE_SNAPSHOT", snapshot });
        },

        reset: () => {
          set({
            state: createInitialExamState(), // ✅ Reset to initial null remainingTime
            sessionId: "",
            session: null,
            questions: [],
          });
        },
      }),
      {
        name: "exam-storage",
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
