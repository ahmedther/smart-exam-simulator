from rest_framework import serializers
from api.models import Category, Question, ExamSession, ExamQuestion, SessionActivity


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


class ExamResultsSerializer(serializers.ModelSerializer):
    """EPPP-style results display"""

    scaled_score = serializers.IntegerField()
    percentage = serializers.FloatField()
    passed = serializers.BooleanField()
    average_time_per_question = serializers.FloatField()
    performance_level = serializers.SerializerMethodField()
    category_performance = serializers.SerializerMethodField()

    class Meta:
        model = ExamSession
        fields = [
            "session_id",
            "completed_at",
            "total_time_spent",
            "total_questions",
            "correct_answers",
            "scaled_score",  # 200-800
            "percentage",  # Raw %
            "passing_score",  # Usually 500
            "passed",
            "performance_level",  # Descriptive text
            "average_time_per_question",
            "category_performance",
        ]

    def get_performance_level(self, obj):
        """Descriptive performance level"""
        if not obj.scaled_score:
            return None

        score = obj.scaled_score
        if score >= 700:
            return "Excellent"
        elif score >= 600:
            return "Very Good"
        elif score >= 500:
            return "Pass"
        elif score >= 450:
            return "Supervised Practice Level"
        else:
            return "Below Passing"

    def get_category_performance(self, obj):
        from django.db.models import Count, Q

        performance = obj.exam_questions.values(
            "question__category__id", "question__category__name"
        ).annotate(total=Count("id"), correct=Count("id", filter=Q(is_correct=True)))

        return [
            {
                "category_id": p["question__category__id"],
                "category_name": p["question__category__name"],
                "total_questions": p["total"],
                "correct_answers": p["correct"],
                "percentage": (
                    round((p["correct"] / p["total"] * 100), 1) if p["total"] > 0 else 0
                ),
            }
            for p in performance
        ]
