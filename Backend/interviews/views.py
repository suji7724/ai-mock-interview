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
import random
import re

# Create your views here.

FALLBACK_TECHNICAL_QUESTIONS = [
    "Explain the concept of closures in JavaScript.",
    "What is the difference between synchronous and asynchronous programming?",
    "Explain the Box Model in CSS.",
    "What is the difference between a GET and a POST request?",
    "Explain the MVC architecture.",
    "What is the difference between relational and non-relational databases?",
    "Explain the Virtual DOM in React.",
    "What are React hooks, and why were they introduced?",
    "What is the difference between state and props in React?",
    "Explain promises and async/await in JavaScript.",
    "What is the purpose of CORS in web development?",
    "How does the Event Loop work in JavaScript?"
]

FALLBACK_HR_QUESTIONS = [
    "Tell me about yourself.",
    "Why do you want to work at our company?",
    "What are your greatest strengths and weaknesses?",
    "Describe a time when you had to work with a difficult team member.",
    "Where do you see yourself in five years?",
    "Why should we hire you?",
    "Describe a challenging project you worked on and how you handled it.",
    "How do you handle stress and tight deadlines?"
]

# Interview views
class InterviewCreateView(generics.CreateAPIView):

    serializer_class = InterviewSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        interview = serializer.save(user=self.request.user)
        try:
            profile = UserProfile.objects.filter(user=self.request.user).first()
            role = interview.role if interview.role else "Software Developer"
            
            if interview.interview_type == "Assessment Round":
                from assessments.ai_service import generate_assessment_questions
                from assessments.models import Question as MCQQuestion
                resume_text = profile.resume_text if (profile and profile.resume_text) else ""
                if not resume_text:
                    resume_text = f"Candidate is applying for the {role} position."
                mcq_data = generate_assessment_questions(role, resume_text)
                for item in mcq_data:
                    q_text = item.get("question", "")
                    q_options = item.get("options", [])
                    q_correct = item.get("correct_answer", "")
                    q_cat = item.get("category", "General")
                    q_diff = item.get("difficulty", "Medium")
                    if q_correct not in q_options and q_options:
                        q_options.append(q_correct)
                    MCQQuestion.objects.create(
                        question=q_text,
                        options=q_options,
                        correct_answer=q_correct,
                        category=q_cat,
                        difficulty=q_diff,
                        interview_type="Assessment Round",
                        interview=interview,
                        is_ai_generated=True
                    )
            else:
                resume_text = profile.resume_text if (profile and profile.resume_text) else f"Targeting {role} role."
                ai_target_count = random.randint(5, 10)
                ai_response = generate_resume_questions(role, resume_text, count=ai_target_count)
                questions_list = [q.strip() for q in ai_response.split("\n") if q.strip()]
                if not questions_list:
                    questions_list = [
                        f"Explain the technical challenges you solved in your latest project as a {role}.",
                        f"How do you optimize performance in a {role} application?",
                        f"Describe your favorite tools and libraries when working as a {role}.",
                        f"What are the best practices for structuring code in a {role} codebase?",
                        f"How do you handle error logging and debugging in production for a {role} app?"
                    ][:ai_target_count]
                for question_text in questions_list:
                    clean_text = re.sub(r'^\d+[\.\)]\s*|-\s*', '', question_text.strip())
                    if clean_text:
                        Question.objects.create(
                            question_text=clean_text,
                            category="Resume",
                            difficulty="Medium",
                            interview_type=interview.interview_type,
                            is_ai_generated=True,
                            interview=interview,
                        )
        except Exception as e:
            print("Pre-generating questions exception:", e)

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

        # Determine target counts between 5 and 10
        db_target_count = random.randint(5, 10)
        ai_target_count = random.randint(5, 10)

        # Database Questions (only predefined/static ones, not AI generated)
        db_questions_query = Question.objects.filter(
            interview_type=interview_type,
            is_ai_generated=False
        ).exclude(category="Resume").order_by('?')
        
        db_questions = list(db_questions_query)

        # Pad with fallback questions if database does not have enough
        if len(db_questions) < db_target_count:
            fallback_pool = FALLBACK_HR_QUESTIONS if interview_type == "HR Round" else FALLBACK_TECHNICAL_QUESTIONS
            needed = db_target_count - len(db_questions)
            sampled_fallbacks = random.sample(fallback_pool, min(needed, len(fallback_pool)))
            for q_text in sampled_fallbacks:
                question, created = Question.objects.get_or_create(
                    question_text=q_text,
                    category="General",
                    difficulty="Medium",
                    interview_type=interview_type,
                    is_ai_generated=False
                )
                db_questions.append(question)
        else:
            db_questions = db_questions[:db_target_count]

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

                role = interview.role if interview.role else "Software Developer"
                resume_text = profile.resume_text if (profile and profile.resume_text) else f"Targeting {role} role."
                
                ai_response = generate_resume_questions(
                    role,
                    resume_text,
                    count=ai_target_count
                )

                questions_list = [
                    q.strip()
                    for q in ai_response.split("\n")
                    if q.strip()
                ]

                # Fallback if AI response returns empty
                if not questions_list:
                    questions_list = [
                        f"Explain the technical challenges you solved in your latest project as a {role}.",
                        f"How do you optimize performance in a {role} application?",
                        f"Describe your favorite tools and libraries when working as a {role}.",
                        f"What are the best practices for structuring code in a {role} codebase?",
                        f"How do you handle error logging and debugging in production for a {role} app?"
                    ][:ai_target_count]

                created_questions = []

                for question_text in questions_list:
                    clean_text = re.sub(r'^\d+[\.\)]\s*|-\s*', '', question_text.strip())
                    if not clean_text:
                        continue
                    
                    question = Question.objects.create(
                        question_text=clean_text,
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
            resume_text = profile.resume_text if (profile and profile.resume_text) else f"Targeting {role} role."

            ai_response = generate_resume_questions(
                role,
                resume_text,
                count=ai_target_count
            )

            questions_list = [
                q.strip()
                for q in ai_response.split("\n")
                if q.strip()
            ]

            if not questions_list:
                questions_list = [
                    f"Explain the technical challenges you solved in your latest project as a {role}.",
                    f"How do you optimize performance in a {role} application?",
                    f"Describe your favorite tools and libraries when working as a {role}.",
                    f"What are the best practices for structuring code in a {role} codebase?",
                    f"How do you handle error logging and debugging in production for a {role} app?"
                ][:ai_target_count]

            created_questions = []

            for question_text in questions_list:
                clean_text = re.sub(r'^\d+[\.\)]\s*|-\s*', '', question_text.strip())
                if not clean_text:
                    continue
                
                question = Question.objects.create(
                    question_text=clean_text,
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






