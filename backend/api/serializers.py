from rest_framework import serializers
from api.models import Category, Question, ExamSession, ExamQuestion
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers


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


class ExamResultsDetailSerializer(serializers.ModelSerializer):
    """Full serializer with nested data"""

    performance_level = serializers.SerializerMethodField()
    category_performance = serializers.SerializerMethodField()
    accuracy = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    passed = serializers.SerializerMethodField()
    percentage = serializers.SerializerMethodField()
    average_time_per_question = serializers.SerializerMethodField()

    class Meta:
        model = ExamSession
        fields = [
            "session_id",
            "completed_at",
            "total_time_spent",
            "total_questions",
            "correct_answers",
            "scaled_score",
            "percentage",
            "passing_score",
            "passed",
            "status",
            "performance_level",
            "average_time_per_question",
            "category_performance",
        ]

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

    def get_accuracy(self, obj):
        return obj.percentage

    def get_status(self, obj):
        return "Passed" if obj.passed else "Failed"

    def get_passed(self, obj):
        """Access the @property directly"""
        return obj.passed

    def get_percentage(self, obj):
        """Access the @property directly"""
        return obj.percentage

    def get_average_time_per_question(self, obj):
        """Access the @property directly"""
        return obj.average_time_per_question

    def get_category_performance(self, obj):
        """Category breakdown with accuracy"""
        from django.db.models import Count, Q

        performance = obj.exam_questions.values(
            "question__category__id", "question__category__name"
        ).annotate(
            total_questions=Count("id"),
            correct_answers=Count("id", filter=Q(is_correct=True)),
        )

        return [
            {
                "category_id": p["question__category__id"],
                "category_name": p["question__category__name"],
                "total_questions": p["total_questions"],
                "correct_answers": p["correct_answers"],
                "percentage": round(
                    (
                        (p["correct_answers"] / p["total_questions"] * 100)
                        if p["total_questions"] > 0
                        else 0.0
                    ),
                    1,
                ),
            }
            for p in performance
        ]
