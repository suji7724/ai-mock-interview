from django.urls import path

from .views import (
    InterviewFeedbackView
)

urlpatterns = [

    path(
        'interview/<int:interview_id>/',
        InterviewFeedbackView.as_view(),
    ),
]