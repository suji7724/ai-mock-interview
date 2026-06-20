from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ContactMessage(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField()

    subject = models.CharField(max_length=200)

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject

# user profile model
class UserProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    resume = models.FileField(
        upload_to="resumes/",
        blank=True,
        null=True
    )

    resume_text = models.TextField(
        blank=True,
        null=True
    )

    def __str__(self):
        return self.user.username

class ResumeAnalysis(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="resume_analyses"
    )

    ats_score = models.IntegerField()

    job_readiness = models.CharField(max_length=100)

    job_readiness_reason = models.TextField()

    strengths = models.JSONField(default=list)

    improvements = models.JSONField(default=list)

    skills_identified = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - ATS: {self.ats_score}"
