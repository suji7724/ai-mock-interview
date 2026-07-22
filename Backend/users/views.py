from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Avg

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from interviews.models import Interview, Answer
from feedback.models import InterviewFeedback
from assessments.models import AssessmentResult
from .models import UserProfile, ResumeAnalysis

import fitz

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ContactMessageSerializer,
    ResumeAnalysisSerializer
)
from .ai_service import analyze_resume_with_ai


# REGISTER API
class RegisterView(APIView):

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)

            if serializer.is_valid():
                user = serializer.save()
                return Response(
                    {
                        "message": "User registered successfully",
                        "user": {
                            "username": user.username,
                            "email": user.email,
                            "first_name": user.first_name,
                        }
                    },
                    status=status.HTTP_201_CREATED
                )

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print("Register exception:", e)
            return Response(
                {"detail": f"Registration failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


# LOGIN API
class LoginView(APIView):

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)

            if serializer.is_valid():
                return Response(
                    serializer.validated_data,
                    status=status.HTTP_200_OK
                )

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print("Login exception:", e)
            return Response(
                {"detail": f"Login failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


# PROTECTED PROFILE API
class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response({
            'message': 'Authenticated successfully',
            'user': request.user.username,
            'email': request.user.email,
        })


class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        total_interviews = Interview.objects.filter(
            user=request.user
        ).count()

        average_score = (
            InterviewFeedback.objects.filter(
                interview__user=request.user
            ).aggregate(
                avg_score=Avg("overall_score")
            )["avg_score"]
            or 0
        )

        assessment_attempts = (
            AssessmentResult.objects.filter(
                user=request.user
            ).count()
        )

        questions_practiced = (
            Answer.objects.filter(
                interview__user=request.user
            ).count()
        )

        recent_interviews = (
            Interview.objects.filter(
                user=request.user
            )
            .exclude(
                interview_type="Assessment Round"
            )
            .order_by("-created_at")[:5]
        )

        recent_data = []

        for interview in recent_interviews:

            score = 0

            if hasattr(interview, "feedback"):
                score = interview.feedback.overall_score

            recent_data.append({
                "id": interview.id,
                "role": interview.role,
                "type": interview.interview_type,
                "score": score,
                "date": interview.created_at.strftime("%d %b %Y"),
            })

        recent_assessments = (
            AssessmentResult.objects.filter(
                user=request.user
            )
            .order_by("-created_at")[:5]
        )

        assessment_data = []

        for item in recent_assessments:

            assessment_data.append({
                "score": item.score,
                "total": item.total,
                "percentage": item.percentage,
                "date": item.created_at,
            })

        return Response({

            "total_interviews": total_interviews,

            "average_score": round(average_score),

            "assessment_attempts": assessment_attempts,

            "questions_practiced": questions_practiced,

            "recent_interviews": recent_data,

            "recent_assessments": assessment_data,
        })


class ContactMessageView(APIView):

    def post(self, request):

        serializer = ContactMessageSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Message sent"}
            )

        return Response(
            serializer.errors,
            status=400
        )


class UploadResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, created = UserProfile.objects.get_or_create(
            user=request.user
        )

        profile.resume = request.FILES.get("resume")
        profile.save()

        # Extract PDF Text
        pdf_path = profile.resume.path

        doc = fitz.open(pdf_path)

        extracted_text = ""

        for page in doc:

            extracted_text += page.get_text()

        doc.close()

        profile.resume_text = extracted_text

        profile.save()

        return Response({
            "message": "Resume uploaded successfully"
        })


class ResumeAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_file = request.FILES.get("resume")
        if not resume_file:
            return Response({"error": "No resume file provided"}, status=400)

        # Save to User Profile
        profile, created = UserProfile.objects.get_or_create(
            user=request.user
        )
        profile.resume = resume_file
        profile.save()

        # Extract PDF Text
        pdf_path = profile.resume.path
        extracted_text = ""
        try:
            doc = fitz.open(pdf_path)
            for page in doc:
                extracted_text += page.get_text()
            doc.close()
            profile.resume_text = extracted_text
            profile.save()
        except Exception as e:
            return Response(
                {"error": f"Failed to parse PDF resume: {str(e)}"},
                status=400
            )

        if not extracted_text.strip():
            return Response(
                {"error": "Resume text could not be extracted or is empty"},
                status=400
            )

        # Run AI Analysis
        try:
            ai_data = analyze_resume_with_ai(extracted_text)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Log analysis report to DB
        analysis = ResumeAnalysis.objects.create(
            user=request.user,
            ats_score=ai_data.get("ats_score", 60),
            job_readiness=ai_data.get("job_readiness", "Needs Improvement"),
            job_readiness_reason=ai_data.get("job_readiness_reason", ""),
            strengths=ai_data.get("strengths", []),
            improvements=ai_data.get("improvements", []),
            skills_identified=ai_data.get("skills_identified", [])
        )

        serializer = ResumeAnalysisSerializer(analysis)
        return Response(serializer.data, status=201)


class PastAnalysesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = ResumeAnalysis.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = ResumeAnalysisSerializer(analyses, many=True)
        return Response(serializer.data)
        # trigger reload comment
