from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from api.models import ExamSession
from api.serializers import (
    ExamResultsListSerializer,
    ExamResultsDetailSerializer,
)
from api.helpers import ResultsPagination


class ResultsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only API endpoint for completed exam results
    Completely separate from active session management

    GET /api/results/                - List all completed results (paginated)
    GET /api/results/{session_id}/   - Get detailed results for specific exam
    """

    queryset = ExamSession.objects.filter(
        status="completed", completed_at__isnull=False
    )
    serializer_class = ExamResultsListSerializer
    permission_classes = [AllowAny]
    lookup_field = "session_id"
    pagination_class = ResultsPagination

    def get_queryset(self):
        """
        Optimize queryset for results listing
        Only fetch necessary fields for performance
        """
        queryset = (
            super()
            .get_queryset()
            .only(
                "session_id",
                "scaled_score",
                "correct_answers",
                "total_questions",
                "completed_at",
                "total_time_spent",
                "passing_score",
            )
        )

        # Search functionality
        if search := self.request.query_params.get("search"):
            queryset = queryset.filter(Q(session_id__icontains=search))

        # Sorting
        SORT_MAPPING = {
            "date": "completed_at",
            "-date": "-completed_at",
            "score": "scaled_score",
            "-score": "-scaled_score",
            "time": "total_time_spent",
            "-time": "-total_time_spent",
            "accuracy": "correct_answers",
            "-accuracy": "-correct_answers",
        }

        sort_key = self.request.query_params.get("sort", "-date")
        queryset = queryset.order_by(SORT_MAPPING.get(sort_key, "-completed_at"))

        return queryset

    def list(self, request, *args, **kwargs):
        """
        GET /api/results/
        GET /api/results/?page=2
        GET /api/results/?search=abc123
        GET /api/results/?sort=-score

        Returns paginated list of completed exam results
        """
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """
        GET /api/results/{session_id}/

        Get full results with category breakdown and question-level analytics
        """
        try:
            # Prefetch related data for optimal performance
            session = ExamSession.objects.prefetch_related(
                "exam_questions__question__category"
            ).get(session_id=kwargs.get("session_id"), status="completed")

            serializer = ExamResultsDetailSerializer(session)
            return Response(serializer.data)

        except ExamSession.DoesNotExist:
            return Response(
                {"error": "Exam results not found or exam not completed"},
                status=status.HTTP_404_NOT_FOUND,
            )
