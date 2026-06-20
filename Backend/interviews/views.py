from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Interview, Question, Answer

from .serializers import (
    InterviewSerializer,
    QuestionSerializer,
    AnswerSerializer,
)

from users.models import UserProfile
from rest_framework.views import APIView
from rest_framework.response import Response
from .ai_services import generate_resume_questions

# Create your views here.



# Interview views
class InterviewCreateView(generics.CreateAPIView):

    serializer_class = InterviewSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save(user=self.request.user)

# Question views
class QuestionListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        interview_id = request.query_params.get("interview_id")
        interview_type = request.query_params.get("interview_type")

        interview = None
        if interview_id:
            interview = Interview.objects.filter(
                id=interview_id,
                user=request.user
            ).first()
            if interview:
                interview_type = interview.interview_type

        if not interview_type:
            interview_type = "Technical"

        # Database Questions (only predefined/static ones, not AI generated)
        db_questions = Question.objects.filter(
            interview_type=interview_type,
            is_ai_generated=False
        ).exclude(category="Resume").order_by('?')[:5]

        serializer = QuestionSerializer(
            db_questions,
            many=True
        )

        questions = serializer.data

        # Handle AI/Resume Questions
        if interview:
            # Check if we already generated AI questions for this specific interview
            existing_ai_questions = Question.objects.filter(
                interview=interview,
                is_ai_generated=True
            )

            if existing_ai_questions.exists():
                ai_serializer = QuestionSerializer(
                    existing_ai_questions,
                    many=True
                )
                questions.extend(ai_serializer.data)
            else:
                profile = UserProfile.objects.filter(
                    user=request.user
                ).first()

                if profile and profile.resume_text:
                    role = interview.role if interview.role else "Software Developer"
                    ai_response = generate_resume_questions(
                        role,
                        profile.resume_text
                    )

                    questions_list = [
                        q.strip()
                        for q in ai_response.split("\n")
                        if q.strip()
                    ]

                    created_questions = []

                    for question_text in questions_list:
                        question = Question.objects.create(
                            question_text=question_text,
                            category="Resume",
                            difficulty="Medium",
                            interview_type=interview_type,
                            is_ai_generated=True,
                            interview=interview,
                        )
                        created_questions.append(
                            question
                        )

                    ai_serializer = QuestionSerializer(
                        created_questions,
                        many=True
                    )

                    questions.extend(
                        ai_serializer.data
                    )
        else:
            # Fallback if no interview_id is provided
            profile = UserProfile.objects.filter(
                user=request.user
            ).first()

            if profile and profile.resume_text:
                latest_interview = Interview.objects.filter(
                    user=request.user
                ).order_by(
                    "-created_at"
                ).first()

                role = (
                    latest_interview.role
                    if latest_interview
                    else "Software Developer"
                )

                ai_response = generate_resume_questions(
                    role,
                    profile.resume_text
                )

                questions_list = [
                    q.strip()
                    for q in ai_response.split("\n")
                    if q.strip()
                ]

                created_questions = []

                for question_text in questions_list:
                    question = Question.objects.create(
                        question_text=question_text,
                        category="Resume",
                        difficulty="Medium",
                        interview_type=interview_type,
                        is_ai_generated=True,
                    )
                    created_questions.append(
                        question
                    )

                ai_serializer = QuestionSerializer(
                    created_questions,
                    many=True
                )

                questions.extend(
                    ai_serializer.data
                )

        return Response(
            questions
        )


class AnswerCreateView(generics.CreateAPIView):

    serializer_class = AnswerSerializer

    permission_classes = [IsAuthenticated]






