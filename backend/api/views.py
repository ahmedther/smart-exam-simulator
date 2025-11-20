from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db import transaction
from .models import (
    Category,
    Question,
    ExamSession,
    ExamQuestion,
    SessionActivity,
)
from .serializers import (
    CategorySerializer,
    QuestionSerializer,
    ExamSessionSerializer,
    ExamSessionDetailSerializer,
    ExamQuestionSerializer,
    ExamQuestionResultSerializer,
)
from api.helpers import create_exam_session


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for categories
    GET /api/categories/ - List all categories
    GET /api/categories/{id}/ - Get category details
    """

    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class QuestionViewSet(viewsets.ModelViewSet):
    @action(
        detail=False,
        methods=["patch"],
        url_path="update-category",
        permission_classes=[AllowAny],
    )
    def update_category(self, request):
        """
        PATCH /api/questions/update-category/
        Update a question's category based on question text
        """
        question_id = request.data.get("question_id")
        new_category_id = request.data.get("new_category_id")

        if not question_id or not new_category_id:
            return Response(
                {"error": "question_id and new_category_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Get question by unique text
            question = Question.objects.get(id=question_id)

            # Validate category exists
            try:
                new_category = Category.objects.get(id=new_category_id)
            except Category.DoesNotExist:
                return Response(
                    {"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND
                )

            # Update category
            old_category = question.category.name
            question.category = new_category
            question.save()

            return Response(
                {
                    "message": "Category updated successfully",
                    "question_id": question.id,
                    "old_category": old_category,
                    "new_category": new_category.name,
                    "new_category_id": new_category.id,
                }
            )

        except Question.DoesNotExist:
            return Response(
                {"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND
            )


class ExamSessionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for exam sessions
    """

    queryset = ExamSession.objects.all()
    serializer_class = ExamSessionSerializer
    permission_classes = [AllowAny]
    lookup_field = "session_id"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ExamSessionDetailSerializer
        return ExamSessionSerializer

    @action(detail=False, methods=["post"])
    def start(self, request):
        """
        POST /api/exam-sessions/start/
        Create a new exam session with 225 balanced questions

        Body: {
            "browser_fingerprint": "optional_browser_id"
        }

        Returns: Complete session with all 225 questions
        """
        browser_fingerprint = request.data.get("browser_fingerprint")

        try:
            # Create exam session with balanced questions
            session = create_exam_session(browser_fingerprint=browser_fingerprint)

            # Get all exam questions for this session
            exam_questions = session.exam_questions.select_related(
                "question",
                "question__category",
            ).all()

            # Serialize session and questions
            session_data = ExamSessionSerializer(session).data
            questions_data = ExamQuestionSerializer(exam_questions, many=True).data

            return Response(
                {"session": session_data, "questions": questions_data},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def resume(self, request, session_id=None):
        """
        GET /api/exam-sessions/{session_id}/resume/
        Resume an existing exam session

        Returns: Session data with all questions and their current state
        """
        try:
            session = self.get_object()

            # Check if session is resumable
            if session.status not in ["in_progress", "paused"]:
                return Response(
                    {"error": "Session cannot be resumed", "status": session.status},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if time expired
            if session.is_expired():
                session.status = "expired"
                session.save()
                return Response(
                    {"error": "Session time has expired"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Resume the session
            session.status = "in_progress"
            session.save()

            # Log resume activity
            SessionActivity.objects.create(session=session, activity_type="resume")

            # Get all questions
            exam_questions = session.exam_questions.select_related(
                "question",
                "question__category",
            ).all()

            return Response(
                {
                    "session": ExamSessionSerializer(session).data,
                    "questions": ExamQuestionSerializer(exam_questions, many=True).data,
                }
            )

        except ExamSession.DoesNotExist:
            return Response(
                {"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=["patch"])
    def pause(self, request, session_id=None):
        """
        PATCH /api/exam-sessions/{session_id}/pause/
        Pause the exam session

        Body: {
            "total_time_spent": 3600  // seconds
        }
        """
        session = self.get_object()

        if session.status != "in_progress":
            return Response(
                {"error": "Can only pause in-progress sessions"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session.status = "paused"
        session.paused_at = timezone.now()
        session.total_time_spent = request.data.get(
            "total_time_spent", session.total_time_spent
        )
        session.save()

        # Log pause activity
        SessionActivity.objects.create(session=session, activity_type="pause")

        return Response(ExamSessionSerializer(session).data)

    @action(detail=True, methods=["patch"])
    def autosave(self, request, session_id=None):
        """
        PATCH /api/exam-sessions/{session_id}/autosave/
        Auto-save session progress (called every 60 seconds from frontend)

        Body: {
            "total_time_spent": 3600,
            "current_question_number": 45
        }
        """
        session = self.get_object()

        if session.status not in ["in_progress", "paused"]:
            return Response(
                {"error": "Session is not active"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Update session timing
        session.total_time_spent = request.data.get(
            "total_time_spent", session.total_time_spent
        )
        session.current_question_number = request.data.get(
            "current_question_number", session.current_question_number
        )
        session.save()

        return Response(
            {"status": "saved", "session": ExamSessionSerializer(session).data}
        )

    @action(detail=True, methods=["post"])
    def submit(self, request, session_id=None):
        """
        POST /api/exam-sessions/{session_id}/submit/
        Submit and complete the exam

        Returns: Results with score and all questions with correct answers
        """
        session = self.get_object()

        if session.status == "completed":
            return Response(
                {"error": "Session already completed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            # Mark session as completed
            session.status = "completed"
            session.completed_at = timezone.now()
            session.total_time_spent = request.data.get(
                "total_time_spent", session.total_time_spent
            )

            # Calculate score
            session.correct_answers = session.exam_questions.filter(
                is_correct=True
            ).count()
            session.calculate_score()
            session.save()

            # Log submit activity
            SessionActivity.objects.create(session=session, activity_type="submit")

            # Get all questions with results
            exam_questions = session.exam_questions.select_related(
                "question", "question__category", "category"
            ).all()

            return Response(
                {
                    "session": ExamSessionSerializer(session).data,
                    "results": ExamQuestionResultSerializer(
                        exam_questions, many=True
                    ).data,
                }
            )

    @action(detail=False, methods=["post"], url_path="check-active")
    def check_active(self, request):
        """
        POST /api/exam-sessions/check-active/
        Check if there's an active session for this browser

        Body: {
            "browser_fingerprint": "browser_id"
        }

        Returns: { "has_active_session": true/false, "session_id": "uuid" }
        """
        browser_fingerprint = request.data.get("browser_fingerprint")

        if not browser_fingerprint:
            return Response({"has_active_session": False})

        # Find active session for this browser
        active_session = ExamSession.objects.filter(
            browser_fingerprint=browser_fingerprint,
            status__in=["in_progress", "paused"],
        ).last()

        if active_session:
            return Response(
                {
                    "has_active_session": True,
                    "session_id": str(active_session.session_id),
                    "session": ExamSessionSerializer(active_session).data,
                }
            )

        return Response({"has_active_session": False})


class ExamQuestionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for individual exam questions
    """

    queryset = ExamQuestion.objects.all()
    serializer_class = ExamQuestionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter by session if provided"""
        queryset = ExamQuestion.objects.select_related(
            "question", "question__category", "category", "session"
        )
        session_id = self.request.query_params.get("session_id")
        if session_id:
            queryset = queryset.filter(session__session_id=session_id)
        return queryset

    @action(detail=True, methods=["patch"])
    def answer(self, request, pk=None):
        """
        PATCH /api/exam-questions/{id}/answer/
        Submit answer for a question

        Body: {
            "user_answer": "d",
            "time_spent": 45
        }
        """
        exam_question = self.get_object()

        user_answer = request.data.get("user_answer")
        time_spent = request.data.get("time_spent", 0)

        if user_answer not in ["a", "b", "c", "d"]:
            return Response(
                {"error": "Invalid answer. Must be a, b, c, or d"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update answer
        exam_question.user_answer = user_answer
        exam_question.time_spent = time_spent
        exam_question.answered_at = timezone.now()
        exam_question.check_answer()  # Check if correct
        exam_question.save()

        return Response(ExamQuestionSerializer(exam_question).data)

    @action(detail=True, methods=["patch"])
    def toggle_mark(self, request, pk=None):
        """
        PATCH /api/exam-questions/{id}/toggle-mark/
        Toggle marked for review status
        """
        exam_question = self.get_object()
        exam_question.marked_for_review = not exam_question.marked_for_review
        exam_question.save()

        return Response({"marked_for_review": exam_question.marked_for_review})

    @action(detail=True, methods=["patch"])
    def update_category(self, request, pk=None):
        """
        PATCH /api/exam-questions/{id}/update-category/
        Update the category for this question

        Body: {
            "category_id": 5
        }
        """
        exam_question = self.get_object()
        category_id = request.data.get("category_id")

        if not category_id:
            return Response(
                {"error": "category_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            category = Category.objects.get(id=category_id)
            exam_question.category = category
            exam_question.save()

            # Log category change
            SessionActivity.objects.create(
                session=exam_question.session,
                activity_type="category_change",
                metadata={
                    "question_number": exam_question.question_number,
                    "new_category": category.name,
                },
            )

            return Response(ExamQuestionSerializer(exam_question).data)

        except Category.DoesNotExist:
            return Response(
                {"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND
            )


"""
===========================================
API ENDPOINTS CREATED:
===========================================

CATEGORIES:
- GET    /api/categories/                          - List all categories
- GET    /api/categories/{id}/                     - Get category details

EXAM SESSIONS:
- POST   /api/exam-sessions/start/                 - Start new exam (creates 225 questions)
- POST   /api/exam-sessions/check-active/          - Check for active session
- GET    /api/exam-sessions/{session_id}/          - Get session details
- GET    /api/exam-sessions/{session_id}/resume/   - Resume existing session
- PATCH  /api/exam-sessions/{session_id}/pause/    - Pause session
- PATCH  /api/exam-sessions/{session_id}/autosave/ - Auto-save progress
- POST   /api/exam-sessions/{session_id}/submit/   - Submit and complete exam

EXAM QUESTIONS:
- GET    /api/exam-questions/?session_id={uuid}    - Get all questions for session
- GET    /api/exam-questions/{id}/                 - Get specific question
- PATCH  /api/exam-questions/{id}/answer/          - Submit answer
- PATCH  /api/exam-questions/{id}/toggle-mark/     - Mark/unmark for review
- PATCH  /api/exam-questions/{id}/update-category/ - Update question category
"""
