from api.models import Category, Question, ExamSession, ExamQuestion, SessionActivity

# ============================================
# HELPER FUNCTIONS FOR CREATING EXAM SESSIONS
# ============================================
import random
from api.constants import EPPPConfig


def create_exam_session(browser_fingerprint=None):
    """
        Creates a new exam session with 225 balanced questions
    Distributes remainder evenly across all categories
    Returns: ExamSession instance
    """
    session = ExamSession.objects.create(
        browser_fingerprint=browser_fingerprint, status="in_progress"
    )

    # Get all categories
    categories = list(Category.objects.all().order_by("id"))
    num_categories = len(categories)

    if num_categories == 0:
        raise ValueError("No categories found. Please create categories first.")

    # 225 / 9 = 25 per category, 0 remainder
    # But if categories != 9, distribute remainder evenly
    base_questions = EPPPConfig.TOTAL_QUESTIONS // num_categories
    remainder = EPPPConfig.TOTAL_QUESTIONS % num_categories  # Handle remainder

    # Calculate questions per category
    # Distribute remainder one by one across ALL categories cyclically
    questions_per_category = []
    for i in range(num_categories):
        count = base_questions
        if i < remainder:  # First 'remainder' categories get +1
            count += 1
        questions_per_category.append(count)

    all_exam_questions = []

    # Get questions from each category
    for category, num_questions in zip(categories, questions_per_category):
        questions = list(
            Question.objects.filter(category=category, is_active=True).order_by("?")[
                :num_questions
            ]
        )

        if len(questions) < num_questions:
            raise ValueError(
                f"Not enough questions in category '{category.name}'. "
                f"Need {num_questions}, found {len(questions)}"
            )

        # Create ExamQuestion instances (without question_number yet)
        for question in questions:
            all_exam_questions.append(
                ExamQuestion(
                    session=session,
                    question=question,
                    question_number=0,  # Temporary, will reassign after shuffle
                )
            )

    # Shuffle the questions so categories aren't grouped together
    random.shuffle(all_exam_questions)

    # Reassign question numbers after shuffle
    for idx, exam_question in enumerate(all_exam_questions, start=1):
        exam_question.question_number = idx

    # Bulk create all exam questions
    ExamQuestion.objects.bulk_create(all_exam_questions)

    # Log the start activity
    SessionActivity.objects.create(session=session, activity_type="start")

    return session


from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict

# ============================================
# HELPER FUNCTIONS FOR Serializing Paginated Results
# ============================================


class ResultsPagination(PageNumberPagination):
    """Custom pagination for TanStack Router/Query"""

    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        """Returns page numbers instead of URLs"""
        return Response(
            OrderedDict(
                [
                    ("count", self.page.paginator.count),
                    ("total_pages", self.page.paginator.num_pages),
                    ("current_page", self.page.number),
                    ("page_size", self.page_size),
                    ("has_next", self.page.has_next()),
                    ("has_previous", self.page.has_previous()),
                    ("results", data),
                ]
            )
        )


# You can add other helper functions here too


"""
USAGE EXAMPLES:

# 1. Create categories (run once)
categories = [
    "Assessment and Diagnosis",
    "Treatment Planning",
    "Counseling",
    "Professional Responsibility",
    "Ethics",
    "Case Management",
    "Documentation",
    "Pharmacology",
    "Legal Issues"
]
for cat_name in categories:
    Category.objects.get_or_create(name=cat_name)

# 2. Add questions
question = Question.objects.create(
    category=Category.objects.get(name="Treatment Planning"),
    question_text="The best predictor of treatment outcome among adult substance abusers is:",
    choice_a="age",
    choice_b="ethnicity",
    choice_c="history of criminal behavior",
    choice_d="severity of substance abuse problems",
    correct_answer="d",
    explanation="Most studies have found that the best predictors of treatment outcome..."
)

# 3. Create exam session
session = create_exam_session(browser_fingerprint="user_browser_id_123")

# 4. Get questions for the exam
exam_questions = session.exam_questions.all().select_related('question', 'question__category')

# 5. Answer a question
exam_q = ExamQuestion.objects.get(session=session, question_number=1)
exam_q.user_answer = 'd'
exam_q.time_spent = 45
exam_q.answered_at = timezone.now()
exam_q.check_answer()  # Sets is_correct
exam_q.save()

# 6. Mark for review
exam_q.marked_for_review = True
exam_q.save()

# 7. Correct category
new_category = Category.objects.get(name="Ethics")
exam_q.user_corrected_category = new_category
exam_q.save()

# 8. Pause session
session.status = 'paused'
session.paused_at = timezone.now()
session.save()
SessionActivity.objects.create(session=session, activity_type='pause')

# 9. Resume session
session.status = 'in_progress'
session.save()
SessionActivity.objects.create(session=session, activity_type='resume')

# 10. Complete session
session.status = 'completed'
session.completed_at = timezone.now()
session.correct_answers = session.exam_questions.filter(is_correct=True).count()
session.calculate_score()
session.save()
"""
