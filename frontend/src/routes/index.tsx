import { createFileRoute } from "@tanstack/react-router";
import { activeSessionQueryOptions } from "../features/exam/hooks";
import { useCheckActiveExam } from "../features/home/hooks";
import {
  Feature,
  ClipboardIcon,
  ClockIcon,
  StarIcon,
} from "../features/home/components/Features";
import Button from "../components/ui/Button";
import InfoBadge from "../components/ui/InfoBadge";
import ConfirmModal from "../components/ui/ConfirmModal";

// ✅ Properly typed router context

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery(activeSessionQueryOptions(true));
    return {};
  },
  component: HomeComponent,
});

export function HomeComponent() {
  const page = useCheckActiveExam();

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
              text={page.isStarting ? "Starting..." : "Start New Quiz"}
              variant="primary"
              icon="arrow"
              onClick={page.handleStartNewQuizClick}
            />

            {page.hasActiveSession && page.data?.session_id && (
              <Button
                text="Resume Quiz"
                variant="secondary"
                icon="resume"
                onClick={page.handleResumeQuiz}
              />
            )}
          </nav>

          {/* Info badge if quiz can be resumed */}
          {!page.isLoading && page.hasActiveSession && (
            <InfoBadge text="You have an unfinished quiz. Resume to continue where you left off!" />
          )}

          {/* Loading state message */}
          {page.isLoading && (
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
        isOpen={page.showConfirmModal}
        onConfirm={page.handleConfirmNewQuiz}
        onCancel={page.handleCancelNewQuiz}
        title="Start New Quiz?"
        message="You have an active exam session. Starting a new quiz will abandon your current progress. Continue?"
        confirmText="Start New Quiz"
        cancelText="Cancel"
      />
    </>
  );
}

// ✅ Extract repeated components for better maintainability
