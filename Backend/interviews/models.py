from django.db import models
from django.contrib.auth.models import User
# Create your models here.

# The Interview Model
class Interview(models.Model):

    INTERVIEW_TYPES = (
        ('Technical', 'Technical'),
        ('HR Round', 'HR Round'),
        ('Assessment Round', 'Assessment Round'),
    )

    EXPERIENCE_LEVELS = (
        ('Fresher', 'Fresher'),
        ('1-2 Years', '1-2 Years'),
        ('3+ Years', '3+ Years'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='interviews'
    )

    role = models.CharField(max_length=255)

    interview_type = models.CharField(
        max_length=50,
        choices=INTERVIEW_TYPES
    )

    experience_level = models.CharField(
        max_length=50,
        choices=EXPERIENCE_LEVELS
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return f"{self.user.username} - {self.role}"

# The Questions Model

class Question(models.Model):

    DIFFICULTY_LEVELS = (
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    )

    INTERVIEW_TYPES = (
        ('Technical', 'Technical'),
        ('HR Round', 'HR Round'),
        ('Assessment Round', 'Assessment Round'),
    )

    question_text = models.TextField()

    category = models.CharField(max_length=100)

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_LEVELS
    )

    interview_type = models.CharField(
        max_length=50,
        choices=INTERVIEW_TYPES
    )

    is_ai_generated = models.BooleanField(
        default=False
    )

    interview = models.ForeignKey(
        'Interview',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='ai_questions'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return self.question_text[:50]


# Answer Model
class Answer(models.Model):

    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name='answers'
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='answers'
    )

    answer_text = models.TextField(
        blank=True,
        default=""
    )

    ai_feedback = models.TextField(
        blank=True,
        null=True
    )

    score = models.IntegerField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"Answer for {self.question.id}"


