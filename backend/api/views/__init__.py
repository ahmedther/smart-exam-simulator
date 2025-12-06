from api.views.category_views import CategoryViewSet
from api.views.question_views import QuestionViewSet
from api.views.exam_views import ExamSessionViewSet
from api.views.results_views import ResultsViewSet

__all__ = [
    "CategoryViewSet",
    "QuestionViewSet",
    "ExamSessionViewSet",
    "ResultsViewSet",
]


# ============================================================================
# UPDATED API ENDPOINTS SUMMARY
# ============================================================================
"""
CATEGORIES:
- GET    /api/categories/                          - List all categories
- GET    /api/categories/{id}/                     - Get category details

QUESTIONS:
- PATCH  /api/questions/update-category/           - Update question category

EXAM SESSIONS (Active Session Management):
- POST   /api/exam-sessions/start/                 - Start new exam
- POST   /api/exam-sessions/check-active/          - Check for active session
- GET    /api/exam-sessions/{session_id}/          - Get session details
- GET    /api/exam-sessions/{session_id}/resume/   - Resume existing session
- PATCH  /api/exam-sessions/{session_id}/autosave/ - Auto-save progress
- POST   /api/exam-sessions/{session_id}/submit/   - Submit and complete exam

RESULTS (Read-Only Analytics):
- GET    /api/results/                             - List all results (paginated)
- GET    /api/results/?page=2                      - Paginated results
- GET    /api/results/?search=abc123               - Search results
- GET    /api/results/?sort=-score                 - Sorted results
- GET    /api/results/{session_id}/                - Detailed result view
"""
