from django.urls import path

from .views import (
    RegisterView,
    ProfileView,
    LoginView,
    DashboardView,
    ContactMessageView,
    UploadResumeView,
    ResumeAnalysisView,
    PastAnalysesView
)


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path(
        "dashboard/",
        DashboardView.as_view()
    ),
    path(
        "contact/",
        ContactMessageView.as_view()
    ),
    path(
        "upload-resume/",
        UploadResumeView.as_view()
    ),
    path(
        "analyze-resume/",
        ResumeAnalysisView.as_view()
    ),
    path(
        "past-analyses/",
        PastAnalysesView.as_view()
    ),
]