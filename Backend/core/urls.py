"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse

from rest_framework_simplejwt.views import(
    TokenObtainPairView,
    TokenRefreshView,
)

def health_check(request):
    return JsonResponse({"status": "ok", "message": "BitWise Prep API is running"})

urlpatterns = [
    path('', health_check, name='root_health_check'),
    path('api', health_check, name='api_health_check_no_slash'),
    path('api/', health_check, name='api_health_check'),
    path('admin/', admin.site.urls),

    path('api/users/', include('users.urls')),

    path(
        'api/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

    path('api/interviews/', include('interviews.urls')),
    path('api/assessment/', include('assessments.urls')),
    path(
    'api/feedback/',
    include('feedback.urls')
),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )