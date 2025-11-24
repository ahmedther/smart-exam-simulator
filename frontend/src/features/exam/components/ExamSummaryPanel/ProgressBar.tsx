import { motion } from "framer-motion";

interface ProgressBarProps {
  answered: number;
  total: number;
}

export default function ProgressBar({ answered, total }: ProgressBarProps) {
  const percentage = Math.round((answered / total) * 100);

  return (
    <div className="mt-6">
      <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
        <span>Overall Progress</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full gradient-primary"
        />
      </div>
    </div>
  );
}
