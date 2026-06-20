from django.contrib import admin
from .models import Question, AssessmentResult

# Register your models here.
admin.site.register(Question)

@admin.register(AssessmentResult)
class AssessmentResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'total', 'percentage', 'created_at')
    list_filter = ('percentage',)
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at',)