import { motion } from "framer-motion";

interface StatCardProps {
  type: "answered" | "skipped" | "notVisited" | "marked";
  count: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const CONFIG = {
  answered: {
    gradient: "from-green-50 to-emerald-50",
    border: "border-green-200",
    iconBg: "from-green-500 to-emerald-600",
    textColor: "text-green-600",
    icon: (
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    ),
    label: "Answered",
  },
  skipped: {
    gradient: "from-indigo-50 to-purple-50",
    border: "border-indigo-200",
    iconBg: "gradient-primary",
    textColor: "text-indigo-600",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clipRule="evenodd"
      />
    ),
    label: "Skipped",
  },
  notVisited: {
    gradient: "from-red-50 to-pink-50",
    border: "border-red-200",
    iconBg: "from-red-500 to-pink-600",
    textColor: "text-red-500",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    ),
    label: "Not Visited",
  },
  marked: {
    gradient: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    iconBg: "from-amber-500 to-orange-600",
    textColor: "text-amber-600",
    icon: (
      <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
    ),
    label: "Marked",
  },
};

export default function StatCard({
  type,
  count,
  isExpanded,
  onToggle,
}: StatCardProps) {
  const config = CONFIG[type];
  const isClickable = onToggle !== undefined;
  const Component = isClickable ? motion.button : motion.div;

  return (
    <Component
      whileHover={{ scale: 1.05 }}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-xl bg-linear-to-br ${
        config.gradient
      } border ${config.border} ${isClickable ? "cursor-pointer" : ""}`}
    >
      <div
        className={`w-12 h-12 rounded-xl bg-linear-to-br ${config.iconBg} flex items-center justify-center shadow-md`}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {config.icon}
        </svg>
      </div>
      <div className="text-left">
        <p className={`text-2xl font-bold ${config.textColor}`}>{count}</p>
        <p className="text-xs font-medium text-gray-600">{config.label}</p>
      </div>
      {isClickable && (
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className={`w-5 h-5 ${config.textColor} ml-auto`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      )}
    </Component>
  );
}
