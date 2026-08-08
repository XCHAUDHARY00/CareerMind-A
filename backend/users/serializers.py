from rest_framework import serializers
from .models import UserProfile, Skill, Education, CareerGoal

from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__' # Iska matlab saare columns translate kar do

class UserRegistrationSerializer(serializers.ModelSerializer):
    # Password sirf write-only hona chahiye, API response mein kabhi wapas nahi dikhna chahiye
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    # Ye function override karna zaroori hai password ko hash (encrypt) karne ke liye
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model=Skill
        fields='__all__'
class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Education
        fields='__all__'
class CareerGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model=CareerGoal
        fields='__all__'

    