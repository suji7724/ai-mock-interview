from django.contrib import admin
from .models import InterviewFeedback

# Register your models here.
@admin.register(InterviewFeedback)
class InterviewFeedbackAdmin(admin.ModelAdmin):
    list_display = ('interview', 'overall_score', 'created_at')
    list_filter = ('overall_score',)
    search_fields = ('interview__user__username', 'interview__user__email')
    readonly_fields = ('created_at',)
