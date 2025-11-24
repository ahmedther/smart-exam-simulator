import { motion, AnimatePresence } from "framer-motion";
import { useExamStore } from "../../stores/examStore";

interface QuestionDropdownProps {
  type: "answered" | "skipped";
  isOpen: boolean;
  questions: number[];
  count: number;
}

const CONFIG = {
  answered: {
    gradient: "from-green-50 to-emerald-50",
    border: "border-green-200",
    textColor: "text-green-700",
    buttonBg: "from-green-500 to-emerald-600",
    buttonBorder: "border-green-300",
    buttonHover: "hover:border-green-500",
    buttonText: "text-green-600",
    label: "Answered Questions - Click to review:",
  },
  skipped: {
    gradient: "from-indigo-50 to-purple-50",
    border: "border-indigo-200",
    textColor: "text-indigo-700",
    buttonBg: "gradient-primary",
    buttonBorder: "border-indigo-300",
    buttonHover: "hover:border-indigo-500",
    buttonText: "text-indigo-600",
    label: "Skipped Questions - Click to navigate:",
  },
};

export default function QuestionDropdown({
  type,
  isOpen,
  questions,
  count,
}: QuestionDropdownProps) {
  const goToQuestion = useExamStore((s) => s.goToQuestion);
  const currentQuestionIndex = useExamStore(
    (s) => s.state.currentQuestionIndex
  );
  const config = CONFIG[type];

  return (
    <AnimatePresence>
      {isOpen && count > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <div
            className={`p-4 bg-linear-to-br ${config.gradient} rounded-xl border ${config.border}`}
          >
            <p className={`text-sm font-semibold ${config.textColor} mb-3`}>
              {config.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {questions.map((index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    currentQuestionIndex === index
                      ? `bg-linear-to-br ${config.buttonBg} text-white shadow-md`
                      : `bg-white border-2 ${config.buttonBorder} ${config.buttonText} ${config.buttonHover}`
                  }`}
                >
                  {index + 1}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
