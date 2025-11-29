from django.db.models import Count, Q, Avg, Sum


class ExamAnalyticsBuilder:
    """Modern analytics report builder for exam sessions"""

    def __init__(self, session):
        self.session = session
        self.exam_qs = session.exam_questions.select_related(
            "question", "question__category"
        )

    def build_report(self, submission_type):
        """Build comprehensive analytics report"""
        return {
            "submission": self._submission_info(submission_type),
            "performance": self._performance_metrics(),
            "answers": self._answer_breakdown(),
            "timing": self._timing_analysis(),
            "categories": self._category_report(),
            "questions": self._questions_report(),
            "insights": self._generate_insights(),
        }

    def _submission_info(self, submission_type):
        """Submission metadata"""
        return {
            "type": submission_type,
            "at": self.session.completed_at.isoformat(),
            "time_utilized": self.session.total_time_spent,
            "time_available": self.session.exam_duration,
            "time_remaining": self.session.remaining_time(),
            "time_utilization_percent": round(
                (self.session.total_time_spent / self.session.exam_duration) * 100, 1
            ),
        }

    def _performance_metrics(self):
        """Score and pass/fail status"""
        return {
            "scaled_score": self.session.scaled_score,
            "percentage": self.session.percentage,
            "passed": self.session.passed,
            "passing_score": self.session.passing_score,
        }

    def _answer_breakdown(self):
        """Question answer statistics"""
        total = self.exam_qs.count()
        answered = self.exam_qs.filter(answered_at__isnull=False).count()
        correct = self.exam_qs.filter(is_correct=True).count()

        return {
            "total": total,
            "answered": answered,
            "skipped": total - answered,
            "correct": correct,
            "incorrect": answered - correct,
            "marked_for_review": self.exam_qs.filter(marked_for_review=True).count(),
        }

    def _timing_analysis(self):
        """Time statistics"""
        answered = self.exam_qs.filter(answered_at__isnull=False).count()

        return {
            "total_seconds": self.session.total_time_spent,
            "formatted": self._format_time(self.session.total_time_spent),
            "average_per_question": round(self.session.average_time_per_question, 1),
            "average_per_answered": (
                round(self.session.total_time_spent / answered, 1)
                if answered > 0
                else 0
            ),
        }

    def _category_report(self):
        """Category-wise performance breakdown"""
        cats = (
            self.exam_qs.values("question__category__name")
            .annotate(
                total=Count("id"),
                correct=Count("id", filter=Q(is_correct=True)),
                skipped=Count("id", filter=Q(answered_at__isnull=True)),
                avg_time=Avg("time_spent"),
                total_time=Sum("time_spent"),
            )
            .order_by("correct")
        )  # Weakest first

        return [
            {
                "name": cat["question__category__name"],
                "questions": cat["total"],
                "correct": cat["correct"],
                "incorrect": cat["total"] - cat["correct"] - cat["skipped"],
                "skipped": cat["skipped"],
                "accuracy": round((cat["correct"] / cat["total"]) * 100, 1),
                "avg_time_per_question": round(cat["avg_time"] or 0, 1),
                "total_time": cat["total_time"] or 0,
            }
            for cat in cats
        ]

    def _questions_report(self):
        """Detailed question-by-question review"""
        questions = []

        for idx, eq in enumerate(self.exam_qs.select_related("question"), 1):
            q = eq.question
            questions.append(
                {
                    "number": idx,
                    "category": q.category.name,
                    "question": q.question_text,
                    "choices": {
                        "a": q.choice_a,
                        "b": q.choice_b,
                        "c": q.choice_c,
                        "d": q.choice_d,
                    },
                    "user_answer": eq.user_answer,
                    "correct_answer": q.correct_answer,
                    "is_correct": eq.is_correct,
                    "explanation": q.explanation,
                    "time_spent": eq.time_spent,
                    "marked": eq.marked_for_review,
                    "status": (
                        "correct"
                        if eq.is_correct
                        else ("incorrect" if eq.user_answer else "skipped")
                    ),
                }
            )

        return questions

    def _generate_insights(self):
        """Generate actionable insights and recommendations"""
        insights = []
        total = self.exam_qs.count()

        # ✅ Category weakness
        cats = self.exam_qs.values("question__category__name").annotate(
            correct=Count("id", filter=Q(is_correct=True)),
            total=Count("id"),
        )

        weak_cats = [
            c["question__category__name"]
            for c in cats
            if (c["correct"] / c["total"] * 100) < 65
        ]

        if weak_cats:
            insights.append(
                {
                    "type": "weak_categories",
                    "severity": "high" if len(weak_cats) > 2 else "medium",
                    "message": f"Focus on: {', '.join(weak_cats[:3])}",
                }
            )

        # ✅ Skipped questions
        skipped = self.exam_qs.filter(answered_at__isnull=True).count()
        if skipped > total * 0.1:
            insights.append(
                {
                    "type": "unanswered_questions",
                    "severity": "medium",
                    "message": f"{skipped} questions unanswered. Attempt all questions.",
                }
            )

        # ✅ Time pressure
        if self.session.remaining_time() < 600 and self.session.percentage < 70:
            insights.append(
                {
                    "type": "time_pressure",
                    "severity": "high",
                    "message": "You ran out of time. Practice faster question resolution.",
                }
            )

        # ✅ Low confidence (marked for review)
        marked = self.exam_qs.filter(marked_for_review=True).count()
        if marked > total * 0.2:
            insights.append(
                {
                    "type": "low_confidence",
                    "severity": "medium",
                    "message": f"Marked {marked} for review. Build foundational knowledge.",
                }
            )

        # ✅ Overall performance
        if self.session.percentage >= 80:
            insights.append(
                {
                    "type": "excellent",
                    "severity": "low",
                    "message": "Outstanding performance! You're well-prepared.",
                }
            )
        elif self.session.percentage < 50:
            insights.append(
                {
                    "type": "needs_study",
                    "severity": "critical",
                    "message": "Review core concepts before next attempt.",
                }
            )

        return insights

    @staticmethod
    def _format_time(seconds):
        """Format seconds to HH:MM:SS"""
        h, m, s = seconds // 3600, (seconds % 3600) // 60, seconds % 60
        return f"{h:02d}:{m:02d}:{s:02d}"
