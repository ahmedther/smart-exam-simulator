import { Moon, Sun } from "lucide-react";

type Props = {
  isDark: boolean;
  textClass: string;
  subtitleClass: string;
  toggleTheme: () => void;
};

export function RDHeader({
  isDark,
  textClass,
  subtitleClass,
  toggleTheme,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1
          className={`${
            isDark
              ? "text-5xl md:text-6xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3"
              : textClass
          }`}
        >
          Exam Report
        </h1>
        <p className={subtitleClass}>Detailed analysis of your performance</p>
      </div>
      <button
        onClick={toggleTheme}
        className={`p-2.5 rounded-lg transition-all ${
          isDark
            ? "bg-slate-700/50 border border-slate-600 text-yellow-400 hover:bg-slate-600"
            : "bg-gray-100 border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        }`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}
