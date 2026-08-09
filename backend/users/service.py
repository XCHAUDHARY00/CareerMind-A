import os
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
import google.generativeai as genai
import json

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()


def generate_career_roadmap(user_profile):
    """
    Ye function AI se baat karega aur user ki profile dekh kar ek roadmap return karega.
    """
    
    # 1. API Key set karo (Iske liye .env file me GEMINI_API_KEY hona chahiye)
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key is missing!"}
    genai.configure(api_key=api_key)
    
    # 2. Gemini ka kaunsa model use karna hai?
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    # 3. User data ko format karo prompt ke liye
    skills = [skill.name for skill in user_profile.skills.all()]
    skills_text = ", ".join(skills) if skills else "No skills added yet"
    
    # Maan lete hain abhi user ka latest goal utha rahe hain
    latest_goal = user_profile.user_career_goals.last()
    goal_title = latest_goal.title if latest_goal else "General Career Growth"
    # 4. System Prompt Design (Asli jadoo idhar hai!)
    prompt = f"""
    You are an elite AI Career Coach. Based on the following user profile, generate a step-by-step learning roadmap to help them achieve their goal.
    
    Current User Profile:
    - Experience Level: {user_profile.experience}
    - Known Skills: {skills_text}
    - Target Goal: {goal_title}
    
    Output strictly in the following JSON format without any markdown wrappers (like ```json):
    {{
        "roadmap": [
            {{
                "step": 1,
                "title": "Learn the Basics",
                "description": "Start with learning fundamental concepts.",
                "estimated_time": "2 weeks",
                "resources": ["Course link 1", "Book name"]
            }}
        ]
    }}
    """
    
    # 5. AI API Call
    try:
        response = model.generate_content(prompt)
        # AI string return karega (JSON format me), usko python dictionary me convert karte hain
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        elif text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()
        
        roadmap_json = json.loads(text)
        return roadmap_json
    except Exception as e:
        print("AI Error:", str(e))
        return {"error": "Failed to generate roadmap. Please try again."}