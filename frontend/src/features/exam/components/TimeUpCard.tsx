import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useExamSubmission } from "../hooks/useExamSubmission";
import ExamSuccessModal from "./ExamSuccessModal";

const getButtonState = (
  isSubmitting = false,
  isRetrying = false,
  isError = false,
  retryCount = 0
) => {
  if (isRetrying)
    return {
      bg: "from-amber-600 to-orange-600",
      icon: "refresh",
      text: `Retrying (${retryCount}/3)...`,
    };
  if (isSubmitting)
    return {
      bg: "from-blue-600 to-cyan-600",
      icon: "spinner",
      text: "Submitting your exam...",
    };
  if (isError)
    return {
      bg: "from-red-600 to-rose-600",
      icon: "alert",
      text: "Retry Submission",
    };
  return {
    bg: "from-indigo-600 via-purple-600 to-pink-600",
    icon: "check",
    text: "View Results",
  };
};

export default function TimeUpCard() {
  const {
    submitExam,
    isSubmitting,
    isRetrying,
    isError,
    retryCount,
    isSuccess,
    sessionId,
    handleNavigateToResults,
  } = useExamSubmission();
  const hasAutoSubmittedRef = useRef(false);
  const [countdown, setCountdown] = useState(3); // ✅ Track countdown

  // ✅ Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  // ✅ Auto-submit after countdown reaches 0
  useEffect(() => {
    if (
      countdown === 0 &&
      !hasAutoSubmittedRef.current &&
      !isSubmitting &&
      !isRetrying
    ) {
      hasAutoSubmittedRef.current = true;
      submitExam().catch(console.error);
    }
  }, [countdown, isSubmitting, isRetrying, submitExam]);

  const { bg, icon, text } = getButtonState(
    isSubmitting,
    isRetrying,
    isError,
    retryCount
  );
  // ✅ Disable button during countdown
  const isDisabled = isSubmitting || isRetrying || countdown > 0;

  const handleButtonClick = () => {
    if (isError) {
      submitExam().catch(console.error);
    }
  };

  if (isSuccess)
    return (
      <ExamSuccessModal
        isOpen={isSuccess}
        onNavigate={handleNavigateToResults}
        sessionId={sessionId}
      />
    );

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-linear-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80 backdrop-blur-lg flex items-center justify-center z-50 px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.4,
          }}
          className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl border border-indigo-100"
        >
          <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-20 blur-xl -z-10" />

          <div className="text-center space-y-6">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 200,
                delay: 0.2,
              }}
              className="w-24 h-24 mx-auto relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-linear-to-br from-red-400 to-orange-500 rounded-full blur-xl"
              />

              <div className="relative w-full h-full bg-linear-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-14 h-14 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Title & Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <h2 className="text-4xl font-bold mb-2">
                <span className="bg-linear-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Time's Up!
                </span>
              </h2>
              <p className="text-gray-700 text-base leading-relaxed font-medium">
                {isError
                  ? "We encountered an issue submitting your exam. Please try again."
                  : isRetrying
                  ? `Retrying (${retryCount}/3)...`
                  : isSubmitting
                  ? "Submitting your answers..."
                  : countdown > 0
                  ? `Auto-submitting in ${countdown}s...` // ✅ Show countdown
                  : "Your exam has ended. Results will be available shortly."}
              </p>
            </motion.div>

            {/* Info Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isError
                  ? "bg-red-50 border border-red-200"
                  : "bg-emerald-50 border border-emerald-200"
              }`}
            >
              <svg
                className={`w-5 h-5 ${
                  isError ? "text-red-600" : "text-emerald-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {isError ? (
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <span
                className={`text-sm font-medium ${
                  isError ? "text-red-800" : "text-emerald-800"
                }`}
              >
                {isError
                  ? "Unable to submit automatically"
                  : "Responses saved securely"}
              </span>
            </motion.div>

            {/* Action Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.98 }}
              onClick={handleButtonClick}
              disabled={isDisabled}
              className={`w-full relative overflow-hidden bg-linear-to-r ${bg} text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isDisabled ? "opacity-75 cursor-not-allowed" : "hover:shadow-xl"
              }`}
            >
              {icon === "spinner" && (
                <motion.svg
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  <path
                    strokeWidth="2"
                    d="M12 2a10 10 0 010 20"
                    strokeLinecap="round"
                  />
                </motion.svg>
              )}

              {icon === "refresh" && (
                <motion.svg
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </motion.svg>
              )}

              {icon === "alert" && (
                <motion.svg
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 relative z-10"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              )}

              {icon === "check" && (
                <svg
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}

              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
              <span className="relative z-10">
                {countdown > 0 ? `Auto-submitting in ${countdown}s...` : text}
              </span>
            </motion.button>

            {/* Status Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className={`text-sm ${
                isError ? "text-red-600" : "text-gray-600"
              }`}
            >
              {isError
                ? "Your responses were saved, but submission encountered a network issue."
                : isSubmitting || isRetrying
                ? "Please don't close this window..."
                : countdown > 0
                ? "Please keep this window open..." // ✅ Different message during countdown
                : "Your responses were saved and results are ready..."}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
