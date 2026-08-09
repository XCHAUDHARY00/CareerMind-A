import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.service import generate_career_roadmap
from users.models import UserProfile

profile = UserProfile.objects.first()
if not profile:
    print("No profile found")
else:
    result = generate_career_roadmap(profile)
    print("Result:", result)
