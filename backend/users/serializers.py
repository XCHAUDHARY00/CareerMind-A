from rest_framework import serializers
from .models import UserProfile,Skill,Education,CareerGoal

from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    user_educations = serializers.SerializerMethodField()
    user_career_goals = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'experience', 'bio', 'skills', 'user_educations', 'user_career_goals'] 
        depth = 1

    def get_user_educations(self, obj):
        from .models import Education
        return EducationSerializer(obj.user_educations.all(), many=True).data

    def get_user_career_goals(self, obj):
        from .models import CareerGoal
        return CareerGoalSerializer(obj.user_career_goals.all(), many=True).data

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
        read_only_fields = ['user_profile']
class CareerGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model=CareerGoal
        fields='__all__'
        read_only_fields = ['user_profile']

from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'message', 'timestamp']
        

    