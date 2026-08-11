from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserProfileSerializer,UserRegistrationSerializer,SkillSerializer,EducationSerializer,CareerGoalSerializer,ChatMessageSerializer
from .models import UserProfile,Skill,Education,CareerGoal,ChatMessage
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .service import analyze_career_dna,analyze_skill_gaps
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profiles(request):
    profiles = UserProfile.objects.all() # Database se saare profiles nikale
    serializer = UserProfileSerializer(profiles, many=True) # JSON mein translate kiya
    return Response(serializer.data) # Postman ko bhej diya

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    try:
        profile = request.user.profile
        serializer = UserProfileSerializer(profile)
        return Response({
            "status": "success",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Profile not found"
        }, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    serializer=UserProfileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "status":"success",
            "message":"profile created successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"profile creation failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)
@api_view(['PUT','PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request,pk):
    try:
        profile=UserProfile.objects.get(pk=pk)
        serializer=UserProfileSerializer(profile,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status":"success",
                "message":"profile updated successfully",
                "data":serializer.data
            },status=status.HTTP_200_OK)
        else:
            return Response({
                "status":"error",
                "message":"profile update failed",
                "data":serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response({
            "status":"error",
            "message":"profile not found",
            "data":{
                "error":"profile with this id does not exist"
            }
        },status=status.HTTP_404_NOT_FOUND)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile(request,pk):
    try:
        profile=UserProfile.objects.get(pk=pk)
        profile.delete()
        return Response({
            "status":"success",
            "message":"profile deleted successfully",
        },status=status.HTTP_204_NO_CONTENT)
    except UserProfile.DoesNotExist:
        return Response({
            "status":"error",
            "message":"profile not found",
            "data":{
                "error":"profile with this id does not exist"
            }
        },status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def register(request):
    serializer=UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "status":"success",
            "message":"user created successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"user creation failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_skills(request):
    serializer=SkillSerializer(data=request.data)
    if serializer.is_valid():
        skill, created = Skill.objects.get_or_create(name=serializer.validated_data['name'])
        request.user.profile.skills.add(skill)
        return Response({
            "status":"success",
            "message":"skills added successfully",
            "data":SkillSerializer(skill).data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"skills addition failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_education(request):
    data = request.data.copy()
    serializer=EducationSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user_profile=request.user.profile)
        return Response({
            "status":"success",
            "message":"education added successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"education addition failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_carrer_goal(request):
    data = request.data.copy()
    serializer=CareerGoalSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user_profile=request.user.profile)
        return Response({
            "status":"success",
            "message":"carrer goal added successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"carrer goal addition failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_roadmap(request):
    try:
        from .service import generate_career_roadmap
        profile = request.user.profile
        
        force_refresh = request.query_params.get('force') == 'true'
        
        if profile.roadmap_data and not force_refresh:
            roadmap_data = profile.roadmap_data
        else:
            roadmap_data = generate_career_roadmap(profile)
            if "error" not in roadmap_data:
                profile.roadmap_data = roadmap_data
                profile.save(update_fields=['roadmap_data'])
                
        if "error" in roadmap_data:
            return Response({"status": "error", "message": roadmap_data["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            "status": "success",
            "message": "Roadmap retrieved successfully",
            "data": roadmap_data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_skill(request, pk):
    try:
        skill = Skill.objects.get(pk=pk)
        request.user.profile.skills.remove(skill)
        return Response({"status": "success", "message": "Skill removed"}, status=status.HTTP_200_OK)
    except Skill.DoesNotExist:
        return Response({"status": "error", "message": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_education(request, pk):
    try:
        edu = Education.objects.get(pk=pk, user_profile=request.user.profile)
    except Education.DoesNotExist:
        return Response({"status": "error", "message": "Education not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        edu.delete()
        return Response({"status": "success", "message": "Education deleted"}, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = EducationSerializer(edu, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_career_goal(request, pk):
    try:
        goal = CareerGoal.objects.get(pk=pk, user_profile=request.user.profile)
    except CareerGoal.DoesNotExist:
        return Response({"status": "error", "message": "Career Goal not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        goal.delete()
        return Response({"status": "success", "message": "Career Goal deleted"}, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = CareerGoalSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_chat_message(request):
    """
    User naya message bhejega, hum AI se reply mangwayenge aur response denge.
    """
    message = request.data.get("message")
    if not message:
        return Response({"status": "error", "message": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        from .service import interact_with_career_coach
        profile = request.user.profile
        ai_data = interact_with_career_coach(profile, message)
        
        if "error" in ai_data:
            return Response({"status": "error", "message": ai_data["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({
            "status": "success",
            "message": "Response received",
            "data": {
                "response": ai_data["response"]
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    """
    User ki purani chat history return karega.
    """
    try:
        profile = request.user.profile
        messages = ChatMessage.objects.filter(user_profile=profile).order_by('timestamp')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response({
            "status": "success",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def carrer_dna(request):
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        return Response({"status": "error", "message": "Profile not found"}, status=404)
        
    force_refresh = request.query_params.get('force') == 'true'
    
    if profile.career_dna_data and not force_refresh:
        result = profile.career_dna_data
    else:
        result = analyze_career_dna(profile)
        if "error" not in result:
            profile.career_dna_data = result
            profile.save(update_fields=['career_dna_data'])
            
    if "error" in result:
        return Response({"status": "error", "message": result["error"]}, status=500)  

    return Response({"status": "success", "data": result}, status=200)    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def skill_gaps(request):
    """
    User ki skill gaps return karta hai.
    GET /skill-gaps/               → Profile ke career goal se role auto-pick
    GET /skill-gaps/?role=AI+Engineer → Manually override karo
    """
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        return Response({"status": "error", "message": "Profile not found"}, status=404)

    # Smart role selection — 3 level priority
    if request.query_params.get('role'):
        target_role = request.query_params.get('role')
    elif profile.user_career_goals.exists():
        target_role = profile.user_career_goals.last().title
    else:
        target_role = "Software Developer"

    force_refresh = request.query_params.get('force') == 'true'
    
    # Initialize dict if None
    if profile.skill_gaps_data is None:
        profile.skill_gaps_data = {}
        
    if target_role in profile.skill_gaps_data and not force_refresh:
        result = profile.skill_gaps_data[target_role]
    else:
        result = analyze_skill_gaps(profile, target_role)
        if "error" not in result:
            profile.skill_gaps_data[target_role] = result
            profile.save(update_fields=['skill_gaps_data'])

    if "error" in result:
        return Response({"status": "error", "message": result["error"]}, status=500)

    return Response({
        "status": "success",
        "data": result,
        "used_role": target_role
    })

