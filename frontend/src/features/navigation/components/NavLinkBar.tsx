import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useCheckActiveExam } from "../../home/hooks";
import CustomNavLink from "./CustomNavLink";

export default function NavLinkBar() {
  const page = useCheckActiveExam();

  return (
    <>
      <ol className="ml-0 lg:ml-auto max-w-90 lg:max-w-full flex items-stretch bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md">
        <NavItem isFirst>
          <CustomNavLink text="Home" to="/" />
        </NavItem>

        {!page.isOnHomePage ? (
          <NavItem>
            <CustomNavLink text="Exam" to={`/exam/${page.sessionId}`} />
          </NavItem>
        ) : (
          <>
            <NavItem>
              <CustomNavLink
                text={page.hasActiveSession ? "New Exam" : "Exam"}
                to="/exam"
                onClick={page.handleStartNewQuizClick}
                preventNavigation
              />
            </NavItem>
            {page.hasActiveSession && (
              <NavItem>
                <CustomNavLink
                  text="Resume Exam"
                  to="/exam"
                  onClick={page.handleResumeQuiz}
                  preventNavigation
                />
              </NavItem>
            )}
          </>
        )}

        <NavItem>
          <CustomNavLink text="Results" to="/results" />
        </NavItem>
      </ol>

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

type NavItemProps = {
  children: React.ReactNode;
  isFirst?: boolean;
};

// Extract NavItem to reduce repetition
function NavItem({ children, isFirst = false }: NavItemProps) {
  return (
    <li
      className={`relative flex min-w-30 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-white/20 ${
        isFirst ? "first:pl-0 first:before:content-none" : ""
      }`}
    >
      {children}
    </li>
  );
}
