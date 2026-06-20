from django.db import models
from django.db import models
from interviews.models import Interview

# Create your models here.


class InterviewFeedback(models.Model):

    interview = models.OneToOneField(
        Interview,
        on_delete=models.CASCADE,
        related_name='feedback'
    )

    overall_score = models.IntegerField()

    communication_score = models.IntegerField()

    technical_score = models.IntegerField()

    strengths = models.TextField()

    weaknesses = models.TextField()

    recommendation = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"Feedback - "
            f"{self.interview.id}"
        )