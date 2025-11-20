from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    CategoryViewSet,
    QuestionViewSet,
    ExamSessionViewSet,
    ExamQuestionViewSet,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("questions", QuestionViewSet, basename="question")
router.register("exam-sessions", ExamSessionViewSet, basename="exam-session")
router.register("exam-questions", ExamQuestionViewSet, basename="exam-question")


urlpatterns = [
    path("", include(router.urls)),
]
