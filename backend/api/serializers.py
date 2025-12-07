from rest_framework import serializers
from api.models import Category, Question, ExamSession, ExamQuestion
from rest_framework import serializers
from django.db.models import Count, Q, Sum


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""

    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "description", "question_count", "created_at"]
        read_only_fields = ["created_at"]

    def get_question_count(self, obj):
        return obj.questions.filter(is_active=True).count()


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question model - Full details"""

    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "category",
            "category_name",
            "question_text",
            "choice_a",
            "choice_b",
            "choice_c",
            "choice_d",
            "correct_answer",
            "correct_answer_text",
            "explanation",
            "is_active",
        ]
        read_only_fields = ["created_at", "updated_at"]


class QuestionListSerializer(serializers.ModelSerializer):
    """Lighter serializer for listing questions (without explanation/correct answer)"""

    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "category",
            "category_name",
            "question_text",
            "choice_a",
            "choice_b",
            "choice_c",
            "choice_d",
        ]


class ExamQuestionSerializer(serializers.ModelSerializer):
    """Serializer for ExamQuestion - What user sees during exam"""

    question_id = serializers.IntegerField(source="question.id", read_only=True)
    question_text = serializers.CharField(
        source="question.question_text", read_only=True
    )
    choice_a = serializers.CharField(source="question.choice_a", read_only=True)
    choice_b = serializers.CharField(source="question.choice_b", read_only=True)
    choice_c = serializers.CharField(source="question.choice_c", read_only=True)
    choice_d = serializers.CharField(source="question.choice_d", read_only=True)
    category_id = serializers.IntegerField(
        source="question.category.id", read_only=True
    )
    category_name = serializers.CharField(
        source="question.category.name", read_only=True
    )

    class Meta:
        model = ExamQuestion
        fields = [
            "id",
            "question_id",
            "question_number",
            "question_text",
            "choice_a",
            "choice_b",
            "choice_c",
            "choice_d",
            "category_id",
            "category_name",
            "user_answer",
            "time_spent",
            "marked_for_review",
            "first_viewed_at",
            "answered_at",
        ]
        read_only_fields = [
            "question_id",
            "question_number",
            "question_text",
            "choice_a",
            "choice_b",
            "choice_c",
            "choice_d",
            "category_id",
            "category_name",
            "answered_at",
        ]


class ExamSessionSerializer(serializers.ModelSerializer):
    """Serializer for ExamSession"""

    remaining_time = serializers.SerializerMethodField()

    class Meta:
        model = ExamSession
        fields = [
            "session_id",
            "status",
            "started_at",
            "completed_at",
            "total_time_spent",
            "exam_duration",
            "remaining_time",
            "current_question_number",
            "total_questions",
            "scaled_score",
            "correct_answers",
        ]
        read_only_fields = [
            "session_id",
            "started_at",
            "completed_at",
            "scaled_score",
            "correct_answers",
        ]

    def get_remaining_time(self, obj):
        return obj.remaining_time()


class ExamResultsListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for overview cards"""

    # ✅ For @property fields - just use ReadOnlyField with no source
    performance_level = serializers.SerializerMethodField()
    accuracy = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    passing_score = serializers.ReadOnlyField()
    passed = serializers.ReadOnlyField()
    percentage = serializers.ReadOnlyField()
    average_time = serializers.ReadOnlyField(
        source="average_time_per_question"
    )  # ✅ Different name, needs source
    date = serializers.SerializerMethodField()
    total_time = serializers.SerializerMethodField()
    questions_summary = serializers.SerializerMethodField()
    total_questions = serializers.ReadOnlyField()

    class Meta:
        model = ExamSession
        fields = [
            "session_id",
            "scaled_score",
            "performance_level",
            "accuracy",
            "status",
            "date",
            "total_time",
            "questions_summary",
            "total_questions",
            "average_time",
            "passing_score",
            "passed",
            "percentage",
        ]

    def get_accuracy(self, obj):
        if obj.total_questions > 0:
            return round((obj.correct_answers / obj.total_questions * 100), 1)
        return 0.0

    def get_status(self, obj):
        return "Passed" if obj.passed else "Failed"

    def get_total_time(self, obj):
        """Format total time as '2h 15m' or '45m'"""
        seconds = obj.total_time_spent
        if seconds == 0:
            return "0m"
        h = seconds // 3600
        m = (seconds % 3600) // 60
        if h > 0:
            return f"{h}h {m}m"
        return f"{m}m"

    def get_date(self, obj):
        return obj.completed_at.date() if obj.completed_at else None

    def get_questions_summary(self, obj):
        return f"{obj.correct_answers}/{obj.total_questions}"

    def get_performance_level(self, obj):
        score = obj.scaled_score or 0
        if score >= 700:
            return "Excellent"
        elif score >= 600:
            return "Very Good"
        elif score >= 500:
            return "Pass"
        elif score >= 450:
            return "Supervised Practice Level"
        return "Below Passing"


class QuestionReviewSerializer(serializers.ModelSerializer):
    """Serializer for individual question review"""

    question_text = serializers.CharField(
        source="question.question_text", read_only=True
    )
    category = serializers.CharField(source="question.category.name", read_only=True)
    choice_a = serializers.CharField(source="question.choice_a", read_only=True)
    choice_b = serializers.CharField(source="question.choice_b", read_only=True)
    choice_c = serializers.CharField(source="question.choice_c", read_only=True)
    choice_d = serializers.CharField(source="question.choice_d", read_only=True)
    correct_answer = serializers.CharField(
        source="question.correct_answer", read_only=True
    )
    explanation = serializers.CharField(source="question.explanation", read_only=True)

    class Meta:
        model = ExamQuestion
        fields = [
            "question_number",
            "question_text",
            "category",
            "choice_a",
            "choice_b",
            "choice_c",
            "choice_d",
            "user_answer",
            "correct_answer",
            "is_correct",
            "explanation",
            "time_spent",
        ]


class ExamResultsDetailSerializer(serializers.ModelSerializer):
    """
    Comprehensive exam results serializer with all analytics
    Matches frontend requirements from old.tsx
    """

    # Basic metrics (from @property)
    percentage = serializers.ReadOnlyField()
    passed = serializers.ReadOnlyField()
    average_time_per_question = serializers.ReadOnlyField()

    # Computed fields
    performance_level = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    # Submission details
    submission = serializers.SerializerMethodField()

    # Answer breakdown
    answers = serializers.SerializerMethodField()

    # Category performance with full details
    category_performance = serializers.SerializerMethodField()

    # Insights and recommendations
    insights = serializers.SerializerMethodField()

    # Question-by-question review
    questions = serializers.SerializerMethodField()

    class Meta:
        model = ExamSession
        fields = [
            # Basic info
            "session_id",
            "completed_at",
            # Scores
            "scaled_score",
            "percentage",
            "passing_score",
            "passed",
            "status",
            "performance_level",
            # Timing
            "total_time_spent",
            "exam_duration",
            "average_time_per_question",
            # Detailed analytics
            "submission",
            "answers",
            "category_performance",
            "insights",
            "questions",
        ]

    def get_performance_level(self, obj):
        """Performance level based on scaled score"""
        score = obj.scaled_score or 0
        if score >= 700:
            return "Excellent"
        elif score >= 600:
            return "Very Good"
        elif score >= 500:
            return "Pass"
        elif score >= 450:
            return "Supervised Practice Level"
        return "Below Passing"

    def get_status(self, obj):
        """Pass/Fail status"""
        return "Passed" if obj.passed else "Failed"

    def get_submission(self, obj):
        """
        Submission details
        Returns: type (manual/timeout), time utilization stats
        """
        time_used = obj.total_time_spent
        time_available = obj.exam_duration
        time_utilization = (
            round((time_used / time_available * 100), 1) if time_available > 0 else 0.0
        )

        # Determine if auto-submitted (timeout) or manual
        # Check if time ran out (used 100% or more of available time)
        submission_type = "timeout" if time_utilization >= 100 else "manual"

        return {
            "type": submission_type,
            "time_utilized": time_used,  # in seconds
            "time_available": time_available,  # in seconds
            "time_utilization_percent": time_utilization,
        }

    def get_answers(self, obj):
        """
        Answer breakdown statistics
        Returns: total, answered, skipped, correct, incorrect
        """
        exam_questions = obj.exam_questions.all()

        total = exam_questions.count()
        answered = exam_questions.exclude(user_answer__isnull=True).count()
        skipped = exam_questions.filter(user_answer__isnull=True).count()
        correct = exam_questions.filter(is_correct=True).count()
        incorrect = exam_questions.filter(is_correct=False).count()

        return {
            "total": total,
            "answered": answered,
            "skipped": skipped,
            "correct": correct,
            "incorrect": incorrect,
        }

    def get_category_performance(self, obj):
        """
        Category-wise performance breakdown
        Returns: name, accuracy, correct, incorrect, skipped, time stats
        """
        performance = obj.exam_questions.values(
            "question__category__id", "question__category__name"
        ).annotate(
            total_questions=Count("id"),
            correct_answers=Count("id", filter=Q(is_correct=True)),
            incorrect_answers=Count("id", filter=Q(is_correct=False)),
            skipped_questions=Count("id", filter=Q(user_answer__isnull=True)),
            total_time=Sum("time_spent"),
        )

        return [
            {
                "category_id": p["question__category__id"],
                "name": p["question__category__name"],
                "accuracy": round(
                    (
                        (p["correct_answers"] / p["total_questions"] * 100)
                        if p["total_questions"] > 0
                        else 0.0
                    ),
                    1,
                ),
                "correct": p["correct_answers"],
                "incorrect": p["incorrect_answers"],
                "skipped": p["skipped_questions"],
                "total_time": p["total_time"] or 0,
                "avg_time_per_question": round(
                    (
                        (p["total_time"] / p["total_questions"])
                        if p["total_questions"] > 0 and p["total_time"]
                        else 0.0
                    ),
                    1,
                ),
            }
            for p in performance
        ]

    def get_insights(self, obj):
        """
        Generate insights and recommendations based on performance
        Returns: array of insight objects with type, severity, message
        """
        insights = []

        # Get category performance for weak area detection
        categories = self.get_category_performance(obj)
        weak_categories = [c["name"] for c in categories if c["accuracy"] < 50]

        # Get answer stats
        answers = self.get_answers(obj)
        submission = self.get_submission(obj)

        # Weak categories insight
        if weak_categories:
            insights.append(
                {
                    "type": "weak_categories",
                    "severity": "high" if len(weak_categories) > 2 else "medium",
                    "message": f"Focus on: {', '.join(weak_categories[:3])}",
                }
            )

        # Unanswered questions insight
        if answers["skipped"] > 0:
            severity = (
                "high" if answers["skipped"] > obj.total_questions * 0.2 else "medium"
            )
            insights.append(
                {
                    "type": "unanswered_questions",
                    "severity": severity,
                    "message": f"{answers['skipped']} questions unanswered. Attempt all questions.",
                }
            )

        # Time pressure insight
        if submission["time_utilization_percent"] >= 95:
            insights.append(
                {
                    "type": "time_pressure",
                    "severity": "high",
                    "message": "You used most of your time. Practice faster resolution.",
                }
            )
        elif submission["type"] == "timeout":
            insights.append(
                {
                    "type": "time_pressure",
                    "severity": "critical",
                    "message": "You ran out of time. Practice time management.",
                }
            )

        # Overall performance insight
        if obj.percentage < 50:
            insights.append(
                {
                    "type": "needs_study",
                    "severity": "critical",
                    "message": "Review core concepts before next attempt.",
                }
            )
        elif obj.percentage < 70:
            insights.append(
                {
                    "type": "needs_improvement",
                    "severity": "high",
                    "message": "You're improving! Focus on weak areas to reach passing.",
                }
            )
        elif obj.percentage >= 80:
            insights.append(
                {
                    "type": "excellent",
                    "severity": "low",
                    "message": "Excellent performance! Keep up the great work.",
                }
            )

        return insights

    def get_questions(self, obj):
        """
        Complete question-by-question review
        Returns: array of all questions with user answers, correct answers, explanations
        """
        questions = obj.exam_questions.select_related(
            "question", "question__category"
        ).order_by("question_number")

        return QuestionReviewSerializer(questions, many=True).data
