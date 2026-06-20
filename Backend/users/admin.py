from django.contrib import admin
from .models import ContactMessage, UserProfile, ResumeAnalysis

# Register your models here.
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'resume')
    search_fields = ('user__username', 'user__email')

@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ('user', 'ats_score', 'job_readiness', 'created_at')
    list_filter = ('job_readiness',)
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at',)
