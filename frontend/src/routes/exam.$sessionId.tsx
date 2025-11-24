import { createFileRoute } from "@tanstack/react-router";
import ExamHeader from "../features/exam/components/ExamHeader";
import { useAutoSave, userExamSessionOptions } from "../features/exam/hooks";
import Spinner from "../components/ui/Spinner";
import { useExamStore } from "../features/exam/stores/examStore";
import { useEffect } from "react";
import QuestionCard from "../features/exam/components/QuestionCard";
import MarkedQuestionsPanel from "../features/exam/components/MarkedQuestionsPanel";
import type { ExamSession } from "../features/exam/types";
import ExamSummaryPanel from "../features/exam/components/ExamSummaryPanel";

export const Route = createFileRoute("/exam/$sessionId")({
  loader: ({ context: { queryClient }, params: { sessionId } }) => {
    return queryClient.ensureQueryData(userExamSessionOptions(sessionId));
  },
  pendingComponent: () => (
    <Spinner
      fullScreen
      text="Loading Test Questions. Please Wait ..."
      size="lg"
    />
  ),
  component: ExamComponent,
});

function ExamComponent() {
  const data = Route.useLoaderData() as ExamSession;
  const initialize = useExamStore((s) => s.initialize);

  useAutoSave();

  useEffect(() => {
    initialize(data);
  }, [data, initialize]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* {isSaving && <span>Saving...</span>}
        {lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>} */}
        <ExamHeader />
        <ExamSummaryPanel />
        <MarkedQuestionsPanel />
        <QuestionCard />
      </div>
    </div>
  );
}
