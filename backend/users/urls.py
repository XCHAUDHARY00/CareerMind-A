from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
urlpatterns=[
    path('getprofiles/',views.get_profiles,name="getprofiles"),
    path('createprofile/',views.create_profile,name="createprofile"),
    path('updateprofile/<int:pk>/',views.update_profile,name="updateprofile"),
    path('deleteprofile/<int:pk>/',views.delete_profile,name="deleteprofile"),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',views.register,name="register"),
]