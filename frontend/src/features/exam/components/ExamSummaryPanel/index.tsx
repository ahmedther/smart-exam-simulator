import { useExamStore } from "../../stores/examStore";
import { motion } from "framer-motion";
import { useState } from "react";
import StatCard from "./StatCard";
import QuestionDropdown from "./QuestionDropdown";
import ProgressBar from "./ProgressBar";

export default function ExamSummaryPanel() {
  const questions = useExamStore((s) => s.questions);
  const answers = useExamStore((s) => s.state.answers);
  const markedQuestions = useExamStore((s) => s.state.markedQuestions);

  const [showAnswered, setShowAnswered] = useState(false);
  const [showSkipped, setShowSkipped] = useState(false);

  const answersArray =
    answers instanceof Map ? Array.from(answers.values()) : [];

  const stats = {
    total: questions.length,
    answered: answersArray.filter((a) => a.selectedOptionId).length,
    visited: answersArray.filter((a) => !a.selectedOptionId).length,
    notVisited:
      questions.length - (answers instanceof Map ? answers.size : 0) - 1,
    marked: markedQuestions instanceof Set ? markedQuestions.size : 0,
  };
  const answeredQuestions = questions
    .map((q, index) =>
      answers.get(String(q.id))?.selectedOptionId ? index : -1
    )
    .filter((index) => index !== -1);

  const skippedQuestions = questions
    .map((q, index) => {
      const answer = answers.get(String(q.id));
      return answer && !answer.selectedOptionId ? index : -1;
    })
    .filter((index) => index !== -1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism rounded-2xl shadow-lg p-6 border border-indigo-100"
    >
      <h3 className="text-lg font-bold text-gradient mb-6">
        Progress Overview
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          type="answered"
          count={stats.answered}
          isExpanded={showAnswered}
          onToggle={() => setShowAnswered(!showAnswered)}
        />

        <StatCard
          type="skipped"
          count={stats.visited}
          isExpanded={showSkipped}
          onToggle={() => setShowSkipped(!showSkipped)}
        />

        <StatCard
          type="notVisited"
          count={stats.notVisited > 0 ? stats.notVisited : 0}
        />

        <StatCard type="marked" count={stats.marked} />
      </div>

      <QuestionDropdown
        type="answered"
        isOpen={showAnswered}
        questions={answeredQuestions}
        count={stats.answered}
      />

      <QuestionDropdown
        type="skipped"
        isOpen={showSkipped}
        questions={skippedQuestions}
        count={stats.visited}
      />

      <ProgressBar answered={stats.answered} total={stats.total} />
    </motion.div>
  );
}
