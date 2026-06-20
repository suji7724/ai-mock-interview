from django.urls import path

from .views import InterviewCreateView
from .views import QuestionListView
from .views import AnswerCreateView


urlpatterns = [

    path(
        'create/',
        InterviewCreateView.as_view(),
    ),

    path(
        'questions/',
        QuestionListView.as_view(),
    ),

    path(
        'submit-answer/',
        AnswerCreateView.as_view(),
    ),


]