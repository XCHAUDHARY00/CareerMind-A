from django.urls import path
from . import views
urlpatterns=[
    path('',views.health_check),
    path('getprofiles/',views.get_profiles,name="getprofiles"),
    path('createprofile/',views.create_profile,name="createprofile"),

]