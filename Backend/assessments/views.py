from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Question, AssessmentResult
from .serializers import QuestionSerializer
from interviews.models import Interview
from users.models import UserProfile
from .ai_service import generate_assessment_questions

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_questions(request):
    interview_id = request.query_params.get("interview_id")
    
    interview = None
    if interview_id:
        interview = Interview.objects.filter(
            id=interview_id,
            user=request.user
        ).first()

    if interview:
        # Check if AI-generated questions already exist for this interview AND has at least 35 questions
        existing_questions = Question.objects.filter(
            interview=interview,
            is_ai_generated=True
        )
        if existing_questions.count() >= 35:
            serializer = QuestionSerializer(existing_questions, many=True)
            return Response(serializer.data)
        
        # Delete old/insufficient questions for this interview (e.g. legacy 10-question data)
        if existing_questions.exists():
            existing_questions.delete()
        
        mcq_data = generate_assessment_questions()
        
        created_questions = []
        for item in mcq_data:
            q_text = item.get("question", "")
            q_options = item.get("options", [])
            q_correct = item.get("correct_answer", "")
            q_cat = item.get("category", "General")
            q_diff = item.get("difficulty", "Medium")
            
            # Ensure correct answer matches one of the options
            if q_correct not in q_options and q_options:
                q_options.append(q_correct)
            
            question_obj = Question.objects.create(
                question=q_text,
                options=q_options,
                correct_answer=q_correct,
                category=q_cat,
                difficulty=q_diff,
                interview_type="Assessment Round",
                interview=interview,
                is_ai_generated=True
            )
            created_questions.append(question_obj)
        
        if created_questions:
            serializer = QuestionSerializer(created_questions, many=True)
            return Response(serializer.data)

    # Fallback if no interview_id is provided: return 35 generic questions
    non_interview_qs = Question.objects.filter(interview=None, interview_type="Assessment Round")
    if non_interview_qs.count() < 35:
        non_interview_qs.delete()
        mcq_data = generate_assessment_questions()
        created_questions = []
        for item in mcq_data:
            q_text = item.get("question", "")
            q_options = item.get("options", [])
            q_correct = item.get("correct_answer", "")
            q_cat = item.get("category", "General")
            q_diff = item.get("difficulty", "Medium")
            if q_correct not in q_options and q_options:
                q_options.append(q_correct)
            question_obj = Question.objects.create(
                question=q_text,
                options=q_options,
                correct_answer=q_correct,
                category=q_cat,
                difficulty=q_diff,
                interview_type="Assessment Round",
                is_ai_generated=True
            )
            created_questions.append(question_obj)
        non_interview_qs = Question.objects.filter(interview=None, interview_type="Assessment Round")
    
    serializer = QuestionSerializer(non_interview_qs[:35], many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_assessment(request):
    answers = request.data.get("answers", {})
    interview_id = request.data.get("interview_id")
    
    interview = None
    if interview_id:
        interview = Interview.objects.filter(
            id=interview_id,
            user=request.user
        ).first()

    if interview:
        questions = Question.objects.filter(interview=interview)
    else:
        # Fallback to latest Assessment Round interview of this user
        latest_interview = Interview.objects.filter(
            user=request.user,
            interview_type="Assessment Round"
        ).order_by("-created_at").first()
        
        if latest_interview:
            questions = Question.objects.filter(interview=latest_interview)
        else:
            questions = Question.objects.filter(is_ai_generated=False)

    if not questions.exists():
        questions = Question.objects.filter(is_ai_generated=False)

    score = 0
    total = questions.count()

    for question in questions:
        user_answer = answers.get(str(question.id))
        if user_answer == question.correct_answer:
            score += 1
        
    percentage = (score / total) * 100 if total > 0 else 0

    # Save Result
    AssessmentResult.objects.create(
        user=request.user,
        score=score,
        total=total,
        percentage=percentage
    )

    return Response({
        "score": score,
        "total": total,
        "percentage": percentage
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    results = AssessmentResult.objects.filter(
        user=request.user
    )

    total_tests = results.count()
    average_score = 0

    if total_tests > 0:
        average_score = sum(
            r.percentage for r in results
        ) / total_tests

    latest_result = results.order_by(
        '-created_at'
    ).first()

    return Response({
        "user": request.user.first_name,
        "total_tests": total_tests,
        "average_score": round(average_score, 2),
        "latest_score": (
            latest_result.score
            if latest_result else 0
        ),
        "latest_total": (
            latest_result.total
            if latest_result else 0
        ),
    })