from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework.permissions import (
    IsAuthenticated
)

from interviews.models import (
    Interview,
    Answer
)

from .models import InterviewFeedback

from .serializers import (
    InterviewFeedbackSerializer
)

from .ai_service import (
    generate_ai_feedback
)


def generate_feedback(interview):

    answers = Answer.objects.filter(
        interview=interview
    )

    non_empty_answers_count = sum(
        1 for ans in answers if ans.answer_text and ans.answer_text.strip()
    )

    if not answers.exists() or non_empty_answers_count == 0:
        feedback = InterviewFeedback.objects.create(
            interview=interview,
            overall_score=0,
            communication_score=0,
            technical_score=0,
            strengths="No answers were provided. You did not attempt the questions.",
            weaknesses="You did not provide any answers during the interview.",
            recommendation="Please try the mock interview again and provide answers to receive detailed feedback."
        )
        return feedback

    combined_question = ""
    combined_answer = ""

    for i, answer in enumerate(answers, 1):
        combined_question += f"Question {i}: {answer.question.question_text}\n"
        ans_text = answer.answer_text.strip() if answer.answer_text else ""
        if not ans_text:
            combined_answer += f"Answer to Question {i}: [No Answer Provided]\n"
        else:
            combined_answer += f"Answer to Question {i}: {ans_text}\n"

    ai_feedback = generate_ai_feedback(
        combined_question,
        combined_answer
    )

    feedback = (
        InterviewFeedback.objects.create(

            interview=interview,

            overall_score=ai_feedback[
                "overall_score"
            ],

            communication_score=ai_feedback[
                "communication_score"
            ],

            technical_score=ai_feedback[
                "technical_score"
            ],

            strengths=ai_feedback[
                "strengths"
            ],

            weaknesses=ai_feedback[
                "weaknesses"
            ],

            recommendation=ai_feedback[
                "recommendation"
            ],
        )
    )

    return feedback


class InterviewFeedbackView(APIView):

    permission_classes = [IsAuthenticated]

    def get(
        self,
        request,
        interview_id
    ):

        interview = Interview.objects.get(
            id=interview_id,
            user=request.user
        )

        feedback = (
            InterviewFeedback.objects.filter(
                interview=interview
            ).first()
        )

        if not feedback:

            feedback = generate_feedback(
                interview
            )

        serializer = (
            InterviewFeedbackSerializer(
                feedback
            )
        )

        return Response(serializer.data)