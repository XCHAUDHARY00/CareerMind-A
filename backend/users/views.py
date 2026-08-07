from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserProfileSerializer,UserRegistrationSerializer
from .models import UserProfile
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profiles(request):
    profiles = UserProfile.objects.all() # Database se saare profiles nikale
    serializer = UserProfileSerializer(profiles, many=True) # JSON mein translate kiya
    return Response(serializer.data) # Postman ko bhej diya
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
        
    
    