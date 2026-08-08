from django.contrib import admin
from .models import UserProfile, Skill, Education, CareerGoal

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "experience",
        "created_at",
        "updated_at",
    )

admin.site.register(Skill)
admin.site.register(Education)
admin.site.register(CareerGoal)