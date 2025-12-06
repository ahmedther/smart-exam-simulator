import { Moon, Sun, Zap } from "lucide-react";

type Props = {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  classes: {
    iconText: string;
    icon: string | undefined;
    title: string;
    subtitle: string;
  };
};

export function ResultsHeader({ isDark, setIsDark, classes }: Props) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Zap className={classes.icon} />
          <span
            className={`text-sm font-semibold  uppercase tracking-wide ${classes.iconText}`}
          >
            Your Progress
          </span>
        </div>
        <h1 className={classes.title}>
          {isDark ? "Exam Results" : "Exam Results"}
        </h1>
        <p className={classes.subtitle}>
          {isDark
            ? "Track your performance, analyze your strengths, and identify areas for improvement across all your exam attempts."
            : "Track your performance, analyze your strengths, and identify areas for improvement across all your exam attempts."}
        </p>
      </div>
      <button
        onClick={() => setIsDark(!isDark)}
        className={`ml-4 p-2.5 rounded-lg transition-all ${
          isDark
            ? "bg-slate-700/50 border border-slate-600 text-yellow-400 hover:bg-slate-600"
            : "bg-gray-100 border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        }`}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}
