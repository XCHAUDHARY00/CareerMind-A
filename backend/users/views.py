from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserProfileSerializer
from .models import UserProfile
from rest_framework import status
@api_view(['GET'])
def health_check(request):
    return Response({
        "status":"helath is ok",
        "message":"server is running perfect"
    })
@api_view(['GET'])
def get_profiles(request):
    profiles = UserProfile.objects.all() # Database se saare profiles nikale
    serializer = UserProfileSerializer(profiles, many=True) # JSON mein translate kiya
    return Response(serializer.data) # Postman ko bhej diya
@api_view(['POST'])
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