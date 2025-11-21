import { createFileRoute } from "@tanstack/react-router";
import ExamHeader from "../features/exam/components/ExamHeader";
import { userExamSessionOptions } from "../features/exam/hooks";
import Spinner from "../components/ui/Spinner";
import { useExamStore } from "../features/exam/stores/examStore";
import { useEffect } from "react";
import QuestionCard from "../features/exam/components/QuestionCard";
import MarkedQuestionsPanel from "../features/exam/components/MarkedQuestionsPanel";
import TimeUpCard from "../features/exam/components/TimeUpCard";
import type { ExamSession } from "../features/exam/types";

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
  const remainingTime = useExamStore((s) => s.state.remainingTime);
  // const { isSaving, lastSaved } = useAutoSave();

  useEffect(() => {
    initialize(data);
  }, [data, initialize]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* {isSaving && <span>Saving...</span>}
        {lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>} */}

        {/* Header */}
        <ExamHeader />

        <MarkedQuestionsPanel />
        {/* ✅ Disable entire exam interface when time expires */}
        <div
          className={`transition-all duration-300 ${
            remainingTime <= 0
              ? "pointer-events-none opacity-40 select-none"
              : ""
          }`}
        >
          <QuestionCard />
        </div>

        {/* ✅ Show submit button prominently when time expires */}
        {/* TimeUp Modal with AnimatePresence */}
        <TimeUpCard isVisible={remainingTime <= 0} />
      </div>
    </div>
  );
}
