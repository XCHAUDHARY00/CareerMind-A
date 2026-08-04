from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "career_goal",
        "education",
        "experience",
        "bio",
        "skills",
        "created_at",
        "updated_at",
    )