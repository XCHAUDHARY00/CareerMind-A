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
    model = genai.GenerativeModel('gemini-1.5-flash')
    
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


def interact_with_career_coach(user_profile, new_message):
    """
    Ye function user ki profile, chat history fetch karega aur Gemini se chat continue karega.
    """
    from .models import ChatMessage  # Circular import se bachne ke liye
    
    # 1. API Key set karo
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key is missing!"}
    genai.configure(api_key=api_key)
    
    # 2. Database se is user ki purani chat history fetch karo (Purane messages se naye ki taraf)
    chat_history = ChatMessage.objects.filter(user_profile=user_profile).order_by('timestamp')
    
    # 3. Chat history ko Gemini ke format me convert karo
    formatted_history = []
    for msg in chat_history:
        role = 'user' if msg.sender == 'user' else 'model'
        formatted_history.append({
            'role': role,
            'parts': [msg.message]
        })
    
    # 4. User Profile ke hisab se AI ko prompt instruction do (System Instruction)
    skills = [skill.name for skill in user_profile.skills.all()]
    skills_text = ", ".join(skills) if skills else "No skills added yet"
    latest_goal = user_profile.user_career_goals.last()
    goal_title = latest_goal.title if latest_goal else "General Career Growth"
    goal_desc = latest_goal.description if latest_goal else ""
    
    system_instruction = f"""
    You are an elite AI Career Coach named "CreateMind AI Coach". 
    Your goal is to guide the user on their career path, answer career-related questions, and help them achieve their goals.
    
    User Profile Context:
    - Experience Level: {user_profile.experience}
    - Known Skills: {skills_text}
    - Target Career Goal: {goal_title} ({goal_desc})
    
    Give professional, practical, and highly motivating answers. Keep your answers brief, clean, and conversational. Do NOT use markdown code blocks for normal chat responses.
    """
    
    # 5. Gemini Model initialize karo with System Instruction
    model = genai.GenerativeModel(
        'gemini-1.5-flash',
        system_instruction=system_instruction
    )
    
    # 6. Gemini Chat session start karo purani history ke sath
    chat = model.start_chat(history=formatted_history)
    
    try:
        # 7. AI ko naya message bhejo aur response lo
        response = chat.send_message(new_message)
        ai_response_text = response.text.strip()
        
        # 8. Dono messages database me save karlo
        ChatMessage.objects.create(
            user_profile=user_profile,
            sender='user',
            message=new_message
        )
        ChatMessage.objects.create(
            user_profile=user_profile,
            sender='ai',
            message=ai_response_text
        )
        
        return {"response": ai_response_text}
        
    except Exception as e:
        print("Chatbot Error:", str(e))
        return {"error": "Failed to get response from AI Coach. Please try again."}
def analyze_career_dna(user_profile):
    """
    User ki profile dekh kar AI se complete career DNA analysis karta hai.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key missing"}
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # User data prepare karo
    skills = [skill.name for skill in user_profile.skills.all()]
    skills_text = ", ".join(skills) if skills else "No skills added yet"
    experience = user_profile.experience or "Fresher"
    latest_goal = user_profile.user_career_goals.last()
    goal_title = latest_goal.title if latest_goal else "General Software Development"

    prompt = f"""
You are an AI Career Analyst. Analyze the following student profile and return a detailed career DNA analysis.

Student Profile:
- Experience: {experience}
- Skills: {skills_text}
- Target Goal: {goal_title}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{{
    "radar_data": [
        {{"subject": "Backend", "score": 8}},
        {{"subject": "Frontend", "score": 4}},
        {{"subject": "AI/ML", "score": 3}},
        {{"subject": "DevOps", "score": 2}},
        {{"subject": "Databases", "score": 7}},
        {{"subject": "System Design", "score": 3}}
    ],
    "career_paths": [
        {{"role": "Backend Developer", "match": 86, "icon": "⚙️", "color": "#6366f1"}},
        {{"role": "Full Stack Developer", "match": 65, "icon": "🖥️", "color": "#3b82f6"}},
        {{"role": "AI Engineer", "match": 45, "icon": "🤖", "color": "#8b5cf6"}}
    ],
    "personality_tags": ["Builder", "Analytical", "Problem Solver"],
    "strengths": ["Python", "Django", "SQL"],
    "growth_areas": ["Docker", "System Design", "React"],
    "readiness_score": 72,
    "ai_summary": "2-3 line analysis of the student career potential and next steps."
}}
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # AI kabhi kabhi markdown backticks add kar deta hai, remove karo
        if text.startswith('```json'):
            text = text[7:]
        elif text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print("Career DNA Error:", str(e))
        return {"error": "Failed to analyze career DNA"}
def analyze_skill_gaps(user_profile, target_role):
    """
    User ki skills aur target role ke beech ka gap calculate karta hai.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key missing"}
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # User ki skills fetch karo
    skills = [skill.name for skill in user_profile.skills.all()]
    skills_text = ", ".join(skills) if skills else "None"

    prompt = f"""
You are a Career Skills Analyst. Compare this student's skills against the requirements for the role: "{target_role}".

Student's current skills: {skills_text}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{{
    "target_role": "{target_role}",
    "overall_gap_score": 65,
    "skill_gaps": [
        {{
            "id": 1,
            "name": "Docker",
            "category": "DevOps",
            "current": 2,
            "required": 7,
            "gap": 5,
            "priority": "high",
            "reason": "Docker is essential for deploying backend apps in production environments."
        }},
        {{
            "id": 2,
            "name": "System Design",
            "category": "Architecture",
            "current": 3,
            "required": 6,
            "gap": 3,
            "priority": "medium",
            "reason": "System design skills are tested in most mid-level interviews."
        }}
    ]
}}

Priority rules (follow strictly):
- gap >= 5 → "high"
- gap 3 or 4 → "medium"
- gap <= 2 → "low"

Return exactly 6 to 8 skills. Cover: core language, framework, database, DevOps tool, one concept, one soft skill area.
overall_gap_score is 0-100, higher means more ready (less gap).
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        elif text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print("Skill Gap Error:", str(e))
        return {"error": "Failed to analyze skill gaps"}

