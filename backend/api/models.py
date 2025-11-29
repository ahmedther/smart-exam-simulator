from django.db import models
import uuid

from api.constants import EPPPConfig


class Category(models.Model):
    """
    The 9 question categories
    """

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Question(models.Model):
    """
    Individual exam question with 4 choices
    """

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,  # Prevent deleting categories with questions
        related_name="questions",
    )

    # Question text
    question_text = models.TextField()

    # Four answer choices
    choice_a = models.CharField(max_length=500)
    choice_b = models.CharField(max_length=500)
    choice_c = models.CharField(max_length=500)
    choice_d = models.CharField(max_length=500)

    # Correct answer (a, b, c, or d)
    correct_answer = models.CharField(
        max_length=1,
        choices=[
            ("a", "Choice A"),
            ("b", "Choice B"),
            ("c", "Choice C"),
            ("d", "Choice D"),
        ],
    )

    # Explanation of why the answer is correct
    explanation = models.TextField()

    # Metadata
    is_active = models.BooleanField(default=True)  # To disable questions if needed
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "id"]

    def __str__(self):
        return f"{self.category.name} - {self.question_text[:50]}..."

    @property
    def correct_answer_text(self):
        """Returns the actual text of the correct answer"""
        return getattr(self, f"choice_{self.correct_answer}", "")

    def get_choice_text(self, choice_letter):
        """Helper to get any choice text by letter"""
        return getattr(self, f"choice_{choice_letter}", "")

    class Meta:
        ordering = ["category", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "question_text",
                    "choice_a",
                    "choice_b",
                    "choice_c",
                    "choice_d",
                ],
                name="unique_complete_question",
                violation_error_message="A question and answers with this text already exists.",
            )
        ]


class ExamSession(models.Model):
    """
    Represents a single exam attempt (no user authentication needed)
    Uses UUID for anonymous session tracking
    """

    # Unique session identifier (used instead of user authentication)
    session_id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )

    # Browser fingerprint for resume capability (optional)
    browser_fingerprint = models.CharField(max_length=255, blank=True, null=True)

    # Exam timing
    started_at = models.DateTimeField(auto_now_add=True)
    paused_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Total time spent (in seconds) - tracks actual time, not including pauses
    total_time_spent = models.IntegerField(default=0)  # seconds

    # Exam duration (4.5 hours = 16200 seconds)
    exam_duration = models.IntegerField(
        default=EPPPConfig.EXAM_DURATION_SECONDS
    )  # 4.5 hours

    # Status
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("paused", "Paused"),
        ("completed", "Completed"),
        ("expired", "Expired"),  # If time runs out
        ("abandoned", "Abandoned"),  # If not completed within reasonable time
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="in_progress"
    )

    # Current question number (1-225)
    current_question_number = models.IntegerField(default=1)

    # Score (calculated after completion)
    scaled_score = models.IntegerField(null=True, blank=True)
    total_questions = models.IntegerField(default=EPPPConfig.TOTAL_QUESTIONS)
    passing_score = models.IntegerField(
        default=EPPPConfig.PASSING_SCORE
    )  # ASPPB recommended
    correct_answers = models.IntegerField(default=0)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"Session {self.session_id} - {self.status}"

    def is_expired(self):
        """Check if exam time has expired"""
        if self.status == "completed":
            return False
        elapsed = self.total_time_spent
        return elapsed >= self.exam_duration

    def remaining_time(self):
        """Get remaining time in seconds"""
        return max(0, self.exam_duration - self.total_time_spent)

    def calculate_score(self):
        """
        Calculate EPPP-style scaled score (200-800)

        Real EPPP: 175 scored questions out of 225 total
        50 are unscored pretest questions (randomly distributed)

        For practice purposes, we score all 225 questions
        """
        self.correct_answers = self.exam_questions.filter(is_correct=True).count()

        # Calculate percentage based on all 225 questions
        raw_percentage = (self.correct_answers / self.total_questions) * 100

        # EPPP scaling approximation:
        # ~70% correct ≈ 500 (passing for independent practice)
        # ~65% correct ≈ 450 (passing for supervised practice)
        # ~80% correct ≈ 600

        if raw_percentage >= 70:
            # Above passing: 70%-100% → 500-800
            self.scaled_score = int(500 + ((raw_percentage - 70) / 30 * 300))
        else:
            # Below passing: 0%-70% → 200-500
            self.scaled_score = int(200 + (raw_percentage / 70 * 300))

        # Clamp to valid range
        self.scaled_score = max(200, min(800, self.scaled_score))

        return self.scaled_score

    @property
    def percentage(self):
        """Raw percentage correct"""
        return round((self.correct_answers / self.total_questions) * 100, 1)

    @property
    def passed(self):
        """Check if passed (default 500)"""
        return self.scaled_score >= self.passing_score if self.scaled_score else False

    @property
    def average_time_per_question(self):
        """Average seconds per question"""
        answered = self.exam_questions.exclude(answered_at__isnull=True).count()
        return round(self.total_time_spent / answered, 1) if answered > 0 else 0


class ExamQuestion(models.Model):
    """
    Links questions to exam sessions in order
    This creates the 225-question set for each exam session
    """

    session = models.ForeignKey(
        ExamSession, on_delete=models.CASCADE, related_name="exam_questions"
    )

    question = models.ForeignKey(
        Question, on_delete=models.PROTECT, related_name="exam_appearances"
    )

    # Question order in this specific exam (1-225)
    question_number = models.IntegerField()

    # User's answer (can be null if not answered yet)
    user_answer = models.CharField(
        max_length=1,
        choices=[
            ("a", "Choice A"),
            ("b", "Choice B"),
            ("c", "Choice C"),
            ("d", "Choice D"),
        ],
        null=True,
        blank=True,
    )

    # Time tracking for this specific question
    time_spent = models.IntegerField(default=0)  # seconds
    first_viewed_at = models.DateTimeField(null=True, blank=True)
    answered_at = models.DateTimeField(null=True, blank=True)

    # Flag for review
    marked_for_review = models.BooleanField(default=False)

    # Track if answer is correct (calculated after answering)
    is_correct = models.BooleanField(null=True, blank=True)

    class Meta:
        ordering = ["session", "question_number"]
        unique_together = ["session", "question_number"]
        indexes = [
            models.Index(fields=["session", "question_number"]),
            models.Index(fields=["session", "marked_for_review"]),
        ]

    def __str__(self):
        return f"Session {self.session.session_id} - Q{self.question_number}"

    def check_answer(self):
        """Check if user's answer is correct and update is_correct field"""
        if self.user_answer:
            self.is_correct = self.user_answer == self.question.correct_answer
            return self.is_correct
        return None


class SessionActivity(models.Model):
    """
    Track pause/resume events for accurate time tracking
    Optional but useful for debugging and analytics
    """

    session = models.ForeignKey(
        ExamSession, on_delete=models.CASCADE, related_name="activities"
    )

    ACTIVITY_CHOICES = [
        ("start", "Started"),
        ("pause", "Paused"),
        ("resume", "Resumed"),
        ("submit", "Submitted"),
        ("category_change", "Category Changed"),
    ]

    activity_type = models.CharField(max_length=20, choices=ACTIVITY_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    # Optional metadata
    metadata = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ["timestamp"]
        verbose_name_plural = "Session Activities"

    def __str__(self):
        return f"{self.session.session_id} - {self.activity_type} at {self.timestamp}"
