from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
import json
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
    ExamSessionSerializer,
    ExamQuestionSerializer,
    ExamResultsSerializer,
)
from api.helpers import create_exam_session
from api.analytics import ExamAnalyticsBuilder


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
    def autosave(self, request, session_id=None):
        """
        PATCH /api/exam-sessions/{session_id}/autosave/

        Body: {
            "total_time_spent": 3600,
            "current_question_number": 45,
            "answers": [
                {
                    "question_id": "123",
                    "user_answer": "a",
                    "time_spent": 30,
                    "marked_for_review": false
                }
            ]
        }
        """

        try:
            data = (
                request.data
                if request.content_type == "application/json"
                else json.loads(request.body)
            )
        except:
            data = request.data

        session = self.get_object()

        for d in data.items():
            print(d)

        if session.status not in ["in_progress", "paused"]:
            return Response(
                {"error": "Session is not active"}, status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():

            # Update session fields
            session.total_time_spent = data.get(
                "total_time_spent", session.total_time_spent
            )
            session.current_question_number = data.get(
                "current_question_number", session.current_question_number
            )
            session.save()

            # Bulk update answers
            answers_data = request.data.get("answers", [])

            for answer in answers_data:
                exam_q = ExamQuestion.objects.filter(
                    session=session, id=answer["question_id"]
                ).first()

                if not exam_q:
                    continue

                # ✅ ALWAYS set first_viewed_at if not set (even for null answers)
                if not exam_q.first_viewed_at:
                    exam_q.first_viewed_at = timezone.now()

                # ✅ Always update time_spent and marked (even if user_answer is null)
                exam_q.time_spent = answer.get("time_spent", 0)
                exam_q.marked_for_review = answer.get("marked_for_review", False)

                # ✅ Only update answer fields if user actually answered
                user_answer = answer.get("user_answer")

                if user_answer is not None:  # ✅ Changed: explicit None check
                    exam_q.user_answer = user_answer
                    exam_q.answered_at = timezone.now()
                    exam_q.check_answer()

                exam_q.save()

        return Response({"status": "saved"}, status=200)

    @action(detail=True, methods=["post"])
    def submit(self, request, session_id=None):
        """
        POST /api/exam-sessions/{session_id}/submit/

        Submit and complete exam with comprehensive analytics.
        Submission type automatically inferred from remaining_time.
        """
        try:
            session = self.get_object()
        except ExamSession.DoesNotExist:
            return Response(
                {"error": "Session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ✅ Validation: Already completed
        if session.status == "completed":
            return Response(
                {
                    "error": "Session already completed",
                    "session_id": str(session.session_id),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Validation: Session is active
        if session.status not in ["in_progress", "paused"]:
            return Response(
                {"error": f"Cannot submit session with status: {session.status}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Parse request
        try:
            data = (
                request.data
                if request.content_type == "application/json"
                else json.loads(request.body)
            )
        except Exception as e:
            return Response(
                {"error": f"Invalid request data: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            try:
                # ✅ Update session final state
                session.total_time_spent = data.get(
                    "total_time_spent", session.total_time_spent
                )
                session.current_question_number = data.get(
                    "current_question_number", session.current_question_number
                )

                # ✅ Bulk update answers
                for answer in data.get("answers", []):
                    try:
                        exam_q = ExamQuestion.objects.select_for_update().get(
                            session=session, id=answer.get("question_id")
                        )

                        if not exam_q.first_viewed_at:
                            exam_q.first_viewed_at = timezone.now()

                        exam_q.time_spent = answer.get("time_spent", exam_q.time_spent)
                        exam_q.marked_for_review = answer.get(
                            "marked_for_review", False
                        )

                        user_answer = answer.get("user_answer")
                        if user_answer is not None:
                            exam_q.user_answer = user_answer
                            exam_q.answered_at = timezone.now()
                            exam_q.check_answer()

                        exam_q.save()
                    except ExamQuestion.DoesNotExist:
                        continue

                # ✅ Mark complete and calculate scores
                session.status = "completed"
                session.completed_at = timezone.now()
                session.correct_answers = session.exam_questions.filter(
                    is_correct=True
                ).count()
                session.calculate_score()
                session.save()

                # ✅ Infer submission type from remaining time
                remaining_time = session.remaining_time()
                submission_type = "timeout" if remaining_time == 0 else "manual"

                # ✅ Log activity
                SessionActivity.objects.create(
                    session=session,
                    activity_type="submit",
                    metadata={"submission_type": submission_type},
                )

                # ✅ Return response
                return Response(
                    {
                        "message": "Exam submitted successfully.",
                        "session_id": str(session.session_id),
                    },
                    status=status.HTTP_200_OK,
                )

            except Exception as e:
                return Response(
                    {"error": f"Error submitting exam: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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

"""
