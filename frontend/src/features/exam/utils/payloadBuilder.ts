import type { Answer, ExamProgressPayload } from "../types";

export interface PayloadBuilderInput {
  sessionId: string;
  currentQuestionIndex: number;
  totalTimeSpent: number;
  answers: Map<string, Answer>;
  markedQuestions: Set<string>;
  isPaused: boolean;
  questionStartTime: number;
}

export class ExamPayloadBuilder {
  private static calculateAdditionalTime(
    isPaused: boolean,
    questionStartTime: number
  ): number {
    return isPaused ? 0 : Math.floor((Date.now() - questionStartTime) / 1000);
  }

  static buildExamProgressPayload(
    input: PayloadBuilderInput
  ): ExamProgressPayload {
    const additionalTime = this.calculateAdditionalTime(
      input.isPaused,
      input.questionStartTime
    );

    return {
      total_time_spent: input.totalTimeSpent + additionalTime,
      current_question_number: input.currentQuestionIndex + 1,
      answers: Array.from(input.answers.entries()).map(([qId, ans]) => ({
        question_id: qId,
        user_answer: ans.selectedOptionId!,
        time_spent: ans.timeSpent,
        marked_for_review: input.markedQuestions.has(qId),
      })),
    };
  }

  static createSnapshot(input: Omit<PayloadBuilderInput, "sessionId">): string {
    return JSON.stringify({
      answers: Array.from(input.answers.entries()),
      marked: Array.from(input.markedQuestions),
      index: input.currentQuestionIndex,
    });
  }
}
