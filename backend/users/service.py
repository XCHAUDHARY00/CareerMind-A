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
        'gemini-2.5-flash',
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