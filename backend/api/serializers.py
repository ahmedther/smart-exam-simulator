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

    question_text = serializers.CharField(
        source="question.question_text", read_only=True
    )
    choice_a = serializers.CharField(source="question.choice_a", read_only=True)
    choice_b = serializers.CharField(source="question.choice_b", read_only=True)
    choice_c = serializers.CharField(source="question.choice_c", read_only=True)
    choice_d = serializers.CharField(source="question.choice_d", read_only=True)
    category_id = serializers.IntegerField(source="category.id", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = ExamQuestion
        fields = [
            "id",
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
            "answered_at",
        ]
        read_only_fields = [
            "question_number",
            "question_text",
            "choice_a",
            "choice_b",
            "choice_c",
            "choice_d",
            "answered_at",
        ]


class ExamQuestionResultSerializer(serializers.ModelSerializer):
    """Serializer for showing results after completion (includes correct answer & explanation)"""

    question_text = serializers.CharField(
        source="question.question_text", read_only=True
    )
    choice_a = serializers.CharField(source="question.choice_a", read_only=True)
    choice_b = serializers.CharField(source="question.choice_b", read_only=True)
    choice_c = serializers.CharField(source="question.choice_c", read_only=True)
    choice_d = serializers.CharField(source="question.choice_d", read_only=True)
    correct_answer = serializers.CharField(
        source="question.correct_answer", read_only=True
    )
    explanation = serializers.CharField(source="question.explanation", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = ExamQuestion
        fields = [
            "id",
            "question_number",
            "question_text",
            "choice_a",
            "choice_b",
            "choice_c",
            "choice_d",
            "user_answer",
            "correct_answer",
            "is_correct",
            "explanation",
            "category_name",
            "time_spent",
        ]


class ExamSessionSerializer(serializers.ModelSerializer):
    """Serializer for ExamSession"""

    remaining_time = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

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
            "score",
            "correct_answers",
            "progress_percentage",
        ]
        read_only_fields = [
            "session_id",
            "started_at",
            "completed_at",
            "score",
            "correct_answers",
        ]

    def get_remaining_time(self, obj):
        return obj.remaining_time()

    def get_progress_percentage(self, obj):
        if obj.total_questions > 0:
            return int((obj.current_question_number / obj.total_questions) * 100)
        return 0


class ExamSessionDetailSerializer(serializers.ModelSerializer):
    """Detailed session with all questions"""

    exam_questions = ExamQuestionSerializer(many=True, read_only=True)
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
            "score",
            "correct_answers",
            "exam_questions",
        ]

    def get_remaining_time(self, obj):
        return obj.remaining_time()
