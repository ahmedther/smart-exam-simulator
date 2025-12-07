import { createFileRoute } from "@tanstack/react-router";
import { resultsDetailsQueryOptions } from "../../features/results/config/resultQuery.config";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useResultsTheme } from "../../features/results/hooks/useResultsTheme";
import {
  AnswerBreakdown,
  CategoryGrid,
  DetailedQuestionReview,
  Insights,
  RDHeader,
  RDKeyMatrix,
} from "../../features/results/components";

export const Route = createFileRoute("/results/$sessionId")({
  component: ResultDetail,
  loader: async ({ context: { queryClient }, params: { sessionId } }) => {
    return queryClient.ensureQueryData(resultsDetailsQueryOptions(sessionId));
  },
});

function ResultDetail() {
  const { sessionId } = Route.useParams();
  const { data } = useSuspenseQuery(resultsDetailsQueryOptions(sessionId));

  // Theme management
  const { isDark, toggleTheme, classes } = useResultsTheme();

  return (
    <div className={`${classes.container} p-6 md:p-12`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <RDHeader
          isDark={isDark}
          textClass={classes.title}
          subtitleClass={classes.subtitle}
          toggleTheme={toggleTheme}
        />
        {/* Key Metrics */}
        <RDKeyMatrix
          isDark={isDark}
          cardClass={classes.card}
          subtitleClass={classes.subtitle}
          percentage={data.percentage}
          scaledScore={data.scaled_score}
          textPrimaryClass={classes.iconText}
          timeUtilizationPercent={data.submission.time_utilization_percent}
          submissionType={data.submission.type}
        />
        {/* Answer Breakdown */}
        <AnswerBreakdown
          cardClass={classes.card}
          textPrimaryClass={classes.textPrimary}
          textSecondaryClass={classes.textSecondary}
          totalAnswers={data.answers.total}
          totalCorrect={data.answers.correct}
          totalIncorrect={data.answers.incorrect}
          totalSkipped={data.answers.skipped}
          avgTimePerQuestion={data.average_time_per_question}
        />
        {/* Categories */}
        <CategoryGrid
          isDark={isDark}
          cardClass={classes.card}
          textPrimaryClass={classes.textPrimary}
          textSecondaryClass={classes.textSecondary}
          categoryPerformanceData={data.category_performance}
        />
        {/* Insights */}
        <Insights
          isDark={isDark}
          insights={data.insights}
          cardClass={classes.card}
          textPrimaryClass={classes.textPrimary}
        />
        {/* Questions */}
        <DetailedQuestionReview
          isDark={isDark}
          cardClass={classes.card}
          textPrimaryClass={classes.textPrimary}
          questions={data.questions}
        />
      </div>
    </div>
  );
}
