/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import Button from "../ui/Buttons/Button";
import InfoBadge from "../ui/Info/InfoBadge";
import ConfirmModal from "../ui/Modals/ConfirmModal";
import {
  useStartExam,
  useCheckActiveSession,
  activeSessionQueryOptions,
} from "../hooks/useExam";
import {
  Feature,
  ClipboardIcon,
  ClockIcon,
  StarIcon,
} from "../components/Features/Features";

// ✅ Properly typed router context

export const Route = createFileRoute("/")({
  loader: async ({ context }: any) => {
    context.queryClient.prefetchQuery(activeSessionQueryOptions);
    return {};
  },
  component: HomeComponent,
});

function HomeComponent() {
  const startExam = useStartExam();
  const { data: activeSession, isLoading } = useCheckActiveSession();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasActiveSession = activeSession?.has_active_session ?? false;

  // Use useCallback to memoize handlers and prevent unnecessary re-renders
  const handleStartNewQuizClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (hasActiveSession) {
        setShowConfirmModal(true);
      } else {
        startExam.mutate();
      }
    },
    [hasActiveSession, startExam]
  );

  const handleConfirmNewQuiz = useCallback(() => {
    setShowConfirmModal(false);
    startExam.mutate();
  }, [startExam]);

  const handleCancelNewQuiz = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Main heading */}
          <header className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Ready to Test Your
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                {" "}
                Knowledge?
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Do your best and good luck! 🚀
            </p>
          </header>

          {/* Description */}
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Challenge yourself with our multiple choice questions and see how
            much you really know.
          </p>

          {/* CTA Buttons */}
          <nav className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              text="Start New Quiz"
              variant="primary"
              icon="arrow"
              onClick={handleStartNewQuizClick}
            />

            {hasActiveSession && activeSession?.session_id && (
              <Button
                text="Resume Quiz"
                variant="secondary"
                icon="resume"
                search={{ sessionId: activeSession.session_id }}
              />
            )}
          </nav>

          {/* Info badge if quiz can be resumed */}
          {!isLoading && hasActiveSession && (
            <InfoBadge text="You have an unfinished quiz. Resume to continue where you left off!" />
          )}

          {/* Loading state message */}
          {isLoading && (
            <p className="text-sm text-indigo-600 animate-pulse" role="status">
              Checking for existing sessions...
            </p>
          )}

          {/* Feature highlights */}
          <aside className="pt-8 flex justify-center gap-8 text-sm text-gray-400">
            <Feature icon={<ClipboardIcon />} label="Multiple Choice" />
            <Feature icon={<ClockIcon />} label="Timed Questions" />
            <Feature icon={<StarIcon />} label="Track Progress" />
          </aside>
        </div>
      </main>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmNewQuiz}
        onCancel={handleCancelNewQuiz}
        title="Start New Quiz?"
        message="You have an active exam session. Starting a new quiz will abandon your current progress. Continue?"
        confirmText="Start New Quiz"
        cancelText="Cancel"
      />
    </>
  );
}

// ✅ Extract repeated components for better maintainability
