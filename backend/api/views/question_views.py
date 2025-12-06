from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import Question, Category


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
