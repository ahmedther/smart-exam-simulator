from api.models import Category, Question, ExamSession, ExamQuestion, SessionActivity

# ============================================
# HELPER FUNCTIONS FOR CREATING EXAM SESSIONS
# ============================================


def create_exam_session(browser_fingerprint=None):
    """
    Creates a new exam session with 225 balanced questions
    Returns: ExamSession instance
    """
    from django.db.models import Count
    import random

    # Create the session
    session = ExamSession.objects.create(
        browser_fingerprint=browser_fingerprint, status="in_progress"
    )

    # Get all categories
    categories = Category.objects.all()
    num_categories = categories.count()

    if num_categories == 0:
        raise ValueError("No categories found. Please create categories first.")

    # Calculate questions per category (225 / 9 = 25 per category)
    questions_per_category = 225 // num_categories
    remaining_questions = 225 % num_categories  # Handle remainder

    all_exam_questions = []
    question_number = 1

    # Get balanced questions from each category
    for idx, category in enumerate(categories):
        # Get number of questions for this category
        num_questions = questions_per_category
        if idx < remaining_questions:  # Distribute remainder across first categories
            num_questions += 1

        # Get random questions from this category
        questions = list(
            Question.objects.filter(category=category, is_active=True).order_by("?")[
                :num_questions
            ]
        )

        # Create ExamQuestion instances
        for question in questions:
            exam_question = ExamQuestion(
                session=session,
                question=question,
                question_number=question_number,
                category=category,  # Assume it's in the correct category
            )
            all_exam_questions.append(exam_question)
            question_number += 1

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
