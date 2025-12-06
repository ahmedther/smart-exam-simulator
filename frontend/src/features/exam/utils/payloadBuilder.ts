import type { Answer, ExamProgressPayload } from "../types";

export type PayloadBuilderInput = {
  sessionId: string;
  currentQuestionIndex: number;
  remainingTime: number;
  examDuration: number;
  answers: Map<string, Answer>;
  markedQuestions: Set<string>;
};

export class ExamPayloadBuilder {
  static buildExamProgressPayload(
    input: PayloadBuilderInput
  ): ExamProgressPayload {
    // ✅ Calculate from countdown - simple and accurate
    const totalTimeSpent = input.examDuration - input.remainingTime;

    return {
      total_time_spent: totalTimeSpent,
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
