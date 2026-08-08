from django.contrib.auth.models import User
from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class UserProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    experience = models.CharField(
        max_length=200,
        blank=True
    )

    bio = models.TextField(
        blank=True
    )

    skills = models.ManyToManyField(
        Skill,
        blank=True,
        related_name="user_profiles"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.user.username


class Education(models.Model):
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="user_educations"
    )
    course = models.CharField(
        blank=True,
        max_length=100
    )
    institution = models.CharField(
        blank=True,
        max_length=100
    )
    start_date = models.DateField(
        null=True,
        blank=True
    )
    end_date = models.DateField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.course} from {self.institution}"


class CareerGoal(models.Model):
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="user_career_goals"
    )
    title = models.CharField(
        blank=True,
        max_length=100
    )
    description = models.TextField(
        blank=True,
    )
    target_date = models.DateField(
        null=True,
        blank=True
    )

    def __str__(self):
        return self.title
