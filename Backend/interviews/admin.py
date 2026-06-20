from django.contrib import admin
from .models import Interview, Question, Answer

# Register your models here.

admin.site.register(Interview)
admin.site.register(Question)
admin.site.register(Answer)