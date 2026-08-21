import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


def _get_client():
    """Returns configured google.genai Client."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing!")
    return genai.Client(api_key=api_key)


def generate_career_roadmap(user_profile):
    """
    Ye function AI se baat karega aur user ki profile dekh kar ek roadmap return karega.
    """
    try:
        client = _get_client()
    except ValueError as e:
        return {"error": str(e)}

    skills = [skill.name for skill in user_profile.skills.all()]
    skills_text = ", ".join(skills) if skills else "No skills added yet"
    latest_goal = user_profile.user_career_goals.last()
    goal_title = latest_goal.title if latest_goal else "General Career Growth"

    prompt = f"""
    You are an elite AI Career Coach. Based on the following user profile, generate a step-by-step learning roadmap to help them achieve their goal.
    
    Current User Profile:
    - Experience Level: {user_profile.experience}
    - Known Skills: {skills_text}
    - Target Goal: {goal_title}
    
    Output strictly in the following JSON format without any markdown wrappers:
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
    
    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        elif text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print("AI Error:", str(e))
        return {"error": "Failed to generate roadmap. Please try again."}


def interact_with_career_coach(user_profile, new_message):
    """
    Ye function user ki profile, chat history fetch karega aur Gemini se chat continue karega.
    """
    from .models import ChatMessage

    try:
        client = _get_client()
    except ValueError as e:
        return {"error": str(e)}

    # Database se purani chat history
    chat_history_qs = ChatMessage.objects.filter(user_profile=user_profile).order_by('timestamp')

    # Gemini ke format mein convert karo
    formatted_history = []
    for msg in chat_history_qs:
        role = 'user' if msg.sender == 'user' else 'model'
        formatted_history.append(
            types.Content(role=role, parts=[types.Part(text=msg.message)])
        )

    # User Profile ke hisab se system instruction
    skills = [skill.name for skill in user_profile.skills.all()]
    skills_text = ", ".join(skills) if skills else "No skills added yet"
    latest_goal = user_profile.user_career_goals.last()
    goal_title = latest_goal.title if latest_goal else "General Career Growth"
    goal_desc = latest_goal.description if latest_goal else ""

    system_instruction = f"""
    You are an elite AI Career Coach named "CareerMind AI Coach". 
    Your goal is to guide the user on their career path, answer career-related questions, and help them achieve their goals.
    
    User Profile Context:
    - Experience Level: {user_profile.experience}
    - Known Skills: {skills_text}
    - Target Career Goal: {goal_title} ({goal_desc})
    
    Give professional, practical, and highly motivating answers. Keep your answers brief, clean, and conversational. Do NOT use markdown code blocks for normal chat responses.
    """

    try:
        # Add new user message to history
        formatted_history.append(
            types.Content(role='user', parts=[types.Part(text=new_message)])
        )

        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=formatted_history,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
            )
        )
        ai_response_text = response.text.strip()

        # Save both messages to DB
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
        return {"error": f"AI Coach error: {str(e)}"}


def analyze_career_dna(user_profile):
    """
    User ki profile dekh kar AI se complete career DNA analysis karta hai.
    """
    try:
        client = _get_client()
    except ValueError as e:
        return {"error": str(e)}

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
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        elif text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print("Career DNA Error:", str(e))
        return {"error": f"Failed to analyze career DNA: {str(e)}"}


def analyze_skill_gaps(user_profile, target_role):
    """
    User ki skills aur target role ke beech ka gap calculate karta hai.
    """
    try:
        client = _get_client()
    except ValueError as e:
        return {"error": str(e)}

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
        }}
    ]
}}

Priority rules: gap >= 5 → "high", gap 3 or 4 → "medium", gap <= 2 → "low"
Return exactly 6 to 8 skills. overall_gap_score is 0-100 (higher = more ready).
"""

    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
        )
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
        return {"error": f"Failed to analyze skill gaps: {str(e)}"}
