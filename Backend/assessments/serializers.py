from rest_framework import serializers
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question

        fields = [
            'id',
            'question',
            'options',
            'category',
            'difficulty',
            'interview_type'
        ]