import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Continue",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
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
  }, [isOpen, onCancel]);

  // Handle smooth transitions
  useEffect(() => {
    if (isOpen) {
      // First render the modal (hidden)
      setShouldRender(true);
      // Then trigger the animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      // First hide the modal (trigger exit animation)
      setIsVisible(false);
      // Then remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match this to your transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Enhanced backdrop with gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-950/60 via-purple-950/60 to-indigo-950/60 backdrop-blur-md" />

      {/* Animated gradient orbs in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Modal content */}
      <div
        className={`relative glassmorphism rounded-3xl shadow-2xl max-w-xl w-full p-10 space-y-8 border border-white/20 transition-all duration-300 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-t-3xl" />

        {/* Icon with animated gradient background */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 opacity-20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title with gradient */}
        <h2
          id="modal-title"
          className="text-3xl font-bold text-center bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center text-lg leading-relaxed">
          {message}
        </p>

        {/* Buttons with matching LinkButton style */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:scale-105 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>{cancelText}</span>
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <span>{confirmText}</span>
            <svg
              className="w-5 h-5"
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

        {/* Subtle hint text */}
        <p className="text-center text-sm text-gray-400 pt-2">
          Press{" "}
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
            ESC
          </kbd>{" "}
          to cancel
        </p>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
}

// Demo component to test the modal
function Demo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 rounded-full text-lg font-semibold bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 transform transition-all duration-200"
      >
        Open Modal
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onConfirm={() => {
          console.log("Confirmed!");
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
        title="Start New Quiz?"
        message="You have an active exam session. Starting a new quiz will abandon your current progress. Continue?"
        confirmText="Start New Quiz"
        cancelText="Cancel"
      />
    </div>
  );
}

export { Demo };
