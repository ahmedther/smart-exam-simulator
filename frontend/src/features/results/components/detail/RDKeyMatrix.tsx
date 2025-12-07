import { getPercentageColor, getScoreColor } from "../../theme";

type Props = {
  isDark: boolean;
  cardClass: string;
  subtitleClass: string;
  percentage: number;
  scaledScore: number;
  textPrimaryClass: string;
  timeUtilizationPercent: number;
  submissionType: string;
};

export function RDKeyMatrix({
  isDark,
  cardClass,
  subtitleClass,
  percentage,
  scaledScore,
  textPrimaryClass,
  timeUtilizationPercent,
  submissionType,
}: Props) {
  const bgClass = getScoreColor(scaledScore, isDark);
  const percentageColor = getPercentageColor(percentage, isDark);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className={cardClass}>
        <p className={`text-sm ${subtitleClass} mb-2`}>Scaled Score</p>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-bold bg-linear-to-r ${bgClass.gradient} bg-clip-text text-transparent`}
          >
            {scaledScore}
          </span>
          <span className={subtitleClass}>/800</span>
        </div>
      </div>

      <div className={cardClass}>
        <p className={`text-sm ${subtitleClass} mb-2`}>Accuracy</p>
        <p
          className={`text-4xl font-bold bg-linear-to-r ${percentageColor.gradient} bg-clip-text text-transparent`}
        >
          {percentage.toFixed(1)}%
        </p>
      </div>

      <div className={cardClass}>
        <p className={`text-sm ${subtitleClass} mb-2`}>Time Used</p>
        <p className={`text-4xl font-bold ${textPrimaryClass}`}>
          {timeUtilizationPercent}%
        </p>
      </div>

      <div className={cardClass}>
        <p className={`text-sm ${subtitleClass} mb-2`}>Submission</p>
        <p className={`text-lg font-semibold ${textPrimaryClass}`}>
          {submissionType === "timeout" ? "⏱️ Auto" : "✋ Manual"}
        </p>
      </div>
    </div>
  );
}
