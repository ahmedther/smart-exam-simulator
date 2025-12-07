type Props = {
  cardClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  totalAnswers: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  avgTimePerQuestion: number;
};

export function AnswerBreakdown({
  cardClass,
  textPrimaryClass,
  textSecondaryClass,
  totalAnswers,
  totalCorrect,
  totalIncorrect,
  totalSkipped,
  avgTimePerQuestion,
}: Props) {
  return (
    <div className={`${cardClass} mb-8`}>
      <h2 className={`text-xl font-bold ${textPrimaryClass} mb-4`}>
        Answer Breakdown
      </h2>
      <div className="grid grid-cols-5 gap-3">
        <div className="text-center">
          <p className={`text-3xl font-bold ${textPrimaryClass}`}>
            {totalAnswers}
          </p>
          <p className={textSecondaryClass}>Total</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-emerald-400">{totalCorrect}</p>
          <p className={textSecondaryClass}>Correct</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-rose-400">{totalIncorrect}</p>
          <p className={textSecondaryClass}>Incorrect</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-amber-400">{totalSkipped}</p>
          <p className={textSecondaryClass}>Skipped</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-400">
            {avgTimePerQuestion}s
          </p>
          <p className={textSecondaryClass}>Avg/Q</p>
        </div>
      </div>
    </div>
  );
}
