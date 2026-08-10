from django.db.models import ForeignKey
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
    experience = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    skills = models.ManyToManyField(Skill, related_name='user_profiles', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

class Education(models.Model):
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="user_educations"
    )
    course = models.CharField(max_length=100, blank=True)
    institution = models.CharField(max_length=100, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.course} from {self.institution}"

class CareerGoal(models.Model):
    user_profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="user_career_goals"
    )
    title = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    target_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title
class ChatMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('ai', 'AI'),
    ]
    
    user_profile = models.ForeignKey(
        UserProfile, 
        on_delete=models.CASCADE, 
        related_name="chat_messages"
    )
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.message[:30]}..."
