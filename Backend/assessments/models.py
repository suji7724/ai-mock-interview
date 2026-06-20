from django.db import models

# Create your models here.
from django.db import models

class Question(models.Model):

    question = models.TextField()

    options = models.JSONField()

    correct_answer = models.CharField(max_length=255)

    category = models.CharField(max_length=100)

    difficulty = models.CharField(max_length=50)

    interview_type = models.CharField(max_length=100)

    interview = models.ForeignKey(
        'interviews.Interview',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='assessment_questions'
    )

    is_ai_generated = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.question


from django.contrib.auth.models import User


class AssessmentResult(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    score = models.IntegerField()

    total = models.IntegerField()

    percentage = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.score}/{self.total}"