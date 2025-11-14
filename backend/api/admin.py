from django.contrib import admin

# Register your models here.
# api/admin.py
from django.contrib import admin
from .models import Category, Question, ExamSession, ExamQuestion, SessionActivity


# ============================================
# BASIC REGISTRATION (Simple)
# ============================================

# Option 1: Simple registration
# admin.site.register(Category)
# admin.site.register(Question)
# admin.site.register(ExamSession)
# admin.site.register(ExamQuestion)
# admin.site.register(SessionActivity)


# ============================================
# ADVANCED REGISTRATION (Recommended - Better UI)
# ============================================


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "question_count", "created_at"]
    search_fields = ["name"]
    ordering = ["name"]

    def question_count(self, obj):
        return obj.questions.count()

    question_count.short_description = "Total Questions"


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "category",
        "question_preview",
        "correct_answer",
        "is_active",
        "created_at",
    ]
    list_filter = ["category", "is_active", "correct_answer"]
    search_fields = ["question_text", "choice_a", "choice_b", "choice_c", "choice_d"]
    list_editable = ["is_active"]
    ordering = ["category", "-created_at"]

    fieldsets = (
        ("Question Details", {"fields": ("category", "question_text", "is_active")}),
        (
            "Answer Choices",
            {"fields": ("choice_a", "choice_b", "choice_c", "choice_d")},
        ),
        ("Correct Answer & Explanation", {"fields": ("correct_answer", "explanation")}),
    )

    def question_preview(self, obj):
        return (
            obj.question_text[:80] + "..."
            if len(obj.question_text) > 80
            else obj.question_text
        )

    question_preview.short_description = "Question"


@admin.register(ExamSession)
class ExamSessionAdmin(admin.ModelAdmin):
    list_display = [
        "session_id",
        "status",
        "current_question_number",
        "score",
        "started_at",
        "completed_at",
        "time_spent_display",
    ]
    list_filter = ["status", "started_at", "completed_at"]
    search_fields = ["session_id", "browser_fingerprint"]
    readonly_fields = [
        "session_id",
        "started_at",
        "completed_at",
        "score",
        "correct_answers",
    ]
    ordering = ["-started_at"]

    fieldsets = (
        ("Session Info", {"fields": ("session_id", "browser_fingerprint", "status")}),
        (
            "Timing",
            {
                "fields": (
                    "started_at",
                    "paused_at",
                    "completed_at",
                    "total_time_spent",
                    "exam_duration",
                )
            },
        ),
        ("Progress", {"fields": ("current_question_number", "total_questions")}),
        ("Results", {"fields": ("score", "correct_answers")}),
    )

    def time_spent_display(self, obj):
        hours = obj.total_time_spent // 3600
        minutes = (obj.total_time_spent % 3600) // 60
        seconds = obj.total_time_spent % 60
        return f"{hours}h {minutes}m {seconds}s"

    time_spent_display.short_description = "Time Spent"


class ExamQuestionInline(admin.TabularInline):
    """Inline display of questions in ExamSession"""

    model = ExamQuestion
    extra = 0
    fields = [
        "question_number",
        "question",
        "user_answer",
        "is_correct",
        "time_spent",
        "marked_for_review",
    ]
    readonly_fields = ["question_number", "question", "is_correct"]
    can_delete = False


@admin.register(ExamQuestion)
class ExamQuestionAdmin(admin.ModelAdmin):
    list_display = [
        "session",
        "question_number",
        "question_preview",
        "user_answer",
        "is_correct",
        "time_spent",
        "marked_for_review",
    ]
    list_filter = ["is_correct", "marked_for_review", "session__status"]
    search_fields = ["session__session_id", "question__question_text"]
    readonly_fields = ["session", "question", "question_number", "is_correct"]
    ordering = ["session", "question_number"]

    fieldsets = (
        ("Exam Info", {"fields": ("session", "question", "question_number")}),
        (
            "User Response",
            {"fields": ("user_answer", "is_correct", "category", "marked_for_review")},
        ),
        ("Timing", {"fields": ("time_spent", "first_viewed_at", "answered_at")}),
    )

    def question_preview(self, obj):
        return obj.question.question_text[:60] + "..."

    question_preview.short_description = "Question"


@admin.register(SessionActivity)
class SessionActivityAdmin(admin.ModelAdmin):
    list_display = ["session", "activity_type", "timestamp"]
    list_filter = ["activity_type", "timestamp"]
    search_fields = ["session__session_id"]
    readonly_fields = ["session", "activity_type", "timestamp", "metadata"]
    ordering = ["-timestamp"]

    def has_add_permission(self, request):
        return False  # Don't allow manual creation

    def has_change_permission(self, request, obj=None):
        return False  # Read-only


# ============================================
# OPTIONAL: Customize Admin Site Header
# ============================================

admin.site.site_header = "Smart Exam Simulator Admin"
admin.site.site_title = "Exam Admin Portal"
admin.site.index_title = "Welcome to Exam Management"
