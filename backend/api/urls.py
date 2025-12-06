from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    CategoryViewSet,
    QuestionViewSet,
    ExamSessionViewSet,
    ResultsViewSet,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("questions", QuestionViewSet, basename="question")
router.register("exam-sessions", ExamSessionViewSet, basename="exam-session")
router.register(r"results", ResultsViewSet, basename="results")


urlpatterns = [
    path("", include(router.urls)),
]


"""
============================================================================
RESULTING API STRUCTURE:
============================================================================

CATEGORIES:
✓ GET    /api/categories/
✓ GET    /api/categories/{id}/

QUESTIONS:
✓ PATCH  /api/questions/update-category/

EXAM SESSIONS (Active Management):
✓ POST   /api/exam-sessions/start/
✓ POST   /api/exam-sessions/check-active/
✓ GET    /api/exam-sessions/{session_id}/
✓ GET    /api/exam-sessions/{session_id}/resume/
✓ PATCH  /api/exam-sessions/{session_id}/autosave/
✓ POST   /api/exam-sessions/{session_id}/submit/

RESULTS (Read-Only Analytics):
✓ GET    /api/results/                      [NEW - Clean route!]
✓ GET    /api/results/?page=2
✓ GET    /api/results/?search=abc
✓ GET    /api/results/?sort=-score
✓ GET    /api/results/{session_id}/         [NEW - Clean route!]

DEPRECATED (Remove these from frontend):
✗ GET    /api/exam-sessions/results-all/    [OLD - Remove]
✗ GET    /api/exam-sessions/{id}/detail/    [OLD - Remove]
"""
