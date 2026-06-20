from rest_framework import serializers

from .models import Interview
from .models import Question
from .models import Answer



class InterviewSerializer(serializers.ModelSerializer):

    class Meta:

        model = Interview

        fields = '__all__'

        read_only_fields = ['user', 'created_at']


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:

        model = Question

        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:

        model = Answer

        fields = '__all__'

        read_only_fields = [
            'ai_feedback',
            'score',
            'created_at'
        ]


