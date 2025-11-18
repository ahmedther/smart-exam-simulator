import { createFileRoute } from "@tanstack/react-router";
import ExamHeader from "../features/exam/components/ExamHeader";
import { userExamSessionOptions } from "../hooks/useExam";
import Spinner from "../components/ui/Spinner";
import { useExamStore } from "../features/exam/stores/examStore";
import { useEffect } from "react";
import QuestionCard from "../features/exam/components/QuestionCard";
import MarkedQuestionsPanel from "../features/exam/components/MarkedQuestionsPanel";

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
  // const { sessionId } = Route.useParams();
  const data = Route.useLoaderData();
  const initialize = useExamStore((s) => s.initialize);
  const currentSessionId = useExamStore((s) => s.sessionId);

  // ✅ Initialize Zustand store with server data (only once or when session changes)
  useEffect(() => {
    if (currentSessionId !== data.session.session_id) {
      initialize(data);
    }
  }, [data, initialize, currentSessionId]);
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full space-y-6">
        <ExamHeader />
        <MarkedQuestionsPanel />
        <QuestionCard />
      </div>
    </main>
  );
}
