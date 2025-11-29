import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SuccessModalProps {
  isOpen: boolean;
  onNavigate: () => void;
  sessionId: string;
}

export default function ExamSuccessModal({
  isOpen,
  onNavigate,
  sessionId,
}: SuccessModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Handle smooth transitions
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setCountdown(5);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNavigate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, onNavigate]);

  // Prevent escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      {/* Enhanced backdrop with gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-950/80 via-green-950/80 to-teal-950/80 backdrop-blur-md" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Modal content */}
      <div
        className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full p-12 space-y-8 border border-green-200/50 transition-all duration-500 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-600 via-green-500 to-teal-600 rounded-t-3xl" />

        {/* Success checkmark animation */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Expanding ring animation */}
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-emerald-500 to-green-500 opacity-30 animate-ping" />

            {/* Success circle */}
            <div className="relative w-28 h-28 rounded-full bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl">
              {/* Animated checkmark */}
              <svg
                className="w-16 h-16 text-white animate-[checkmark_0.6s_ease-in-out]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: 50,
                    animation: "checkmarkDraw 0.6s ease-in-out 0.2s forwards",
                  }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h2
            id="success-modal-title"
            className="text-4xl font-bold text-center bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
          >
            Exam Submitted Successfully!
          </h2>
          <p className="text-gray-600 text-center text-lg">
            Your answers have been saved and are being graded.
          </p>
        </div>

        {/* Countdown circle */}
        <div className="flex flex-col items-center space-y-4 py-6">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {/* Animated progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-emerald-500 transition-all duration-1000 ease-linear"
                style={{
                  strokeDasharray: 352,
                  strokeDashoffset: 352 * (1 - countdown / 5),
                }}
              />
            </svg>

            {/* Countdown number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold bg-linear-to-br from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {countdown}
              </span>
            </div>
          </div>

          <p className="text-gray-500 text-center">
            Redirecting to results in{" "}
            <span className="font-semibold text-emerald-600">{countdown}</span>{" "}
            second{countdown !== 1 ? "s" : ""}...
          </p>
        </div>

        {/* Action button */}
        <div className="pt-4">
          <button
            onClick={onNavigate}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-lg font-semibold bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white hover:shadow-2xl hover:scale-105 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
          >
            <span>View Results Now</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

        {/* Session info */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-center text-sm text-gray-400">
            Session ID:{" "}
            <span className="font-mono text-gray-500">{sessionId}</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes checkmarkDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Demo component
function Demo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50">
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 rounded-2xl text-lg font-semibold bg-linear-to-r from-emerald-600 to-green-600 text-white hover:shadow-xl hover:scale-105 transform transition-all duration-200"
      >
        Simulate Exam Submit
      </button>

      <ExamSuccessModal
        isOpen={isOpen}
        onNavigate={() => {
          setIsOpen(false);
          console.log("Navigating to results...");
        }}
        sessionId="abc123-def456-ghi789"
      />
    </div>
  );
}

export { Demo };
