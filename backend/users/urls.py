
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
urlpatterns=[
    path('getprofiles/',views.get_profiles,name="getprofiles"),
    path('myprofile/', views.my_profile, name="myprofile"),
    path('createprofile/',views.create_profile,name="createprofile"),
    path('updateprofile/<int:pk>/',views.update_profile,name="updateprofile"),
    path('deleteprofile/<int:pk>/',views.delete_profile,name="deleteprofile"),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',views.register,name="register"),
    path('addskills/',views.add_skills,name="addskills"),
    path('addeducation/',views.add_education,name="addeducation"),
    path('addcarrergoal/',views.add_carrer_goal,name="addcarrergoal"),
    path('removeskill/<int:pk>/', views.remove_skill, name="removeskill"),
    path('education/<int:pk>/', views.manage_education, name="manageeducation"),
    path('careergoal/<int:pk>/', views.manage_career_goal, name="managecareergoal"),
    path('roadmap/', views.generate_roadmap, name="roadmap"),
    path('chat/send/', views.send_chat_message, name="sendchat"),
    path('chat/history/', views.get_chat_history, name="chathistory"),
    path('carrer-dna/', views.carrer_dna, name="carrer_dna"),
    path('skills_gap/', views.skill_gaps, name="skills_gap"),
]