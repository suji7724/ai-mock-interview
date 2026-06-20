from django.urls import path
from .views import get_questions, submit_assessment, dashboard_stats

urlpatterns = [
    path('questions/', get_questions),
    path('submit/', submit_assessment),
    path('dashboard/', dashboard_stats),
]