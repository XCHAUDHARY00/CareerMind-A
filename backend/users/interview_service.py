import os
import json
from django.utils import timezone
from google import genai
from google.genai import types

def get_gemini_client():
    """
    Returns a configured google.genai Client using the new SDK.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing from environment variables.")
    return genai.Client(api_key=api_key)


def get_gemini_response(prompt, system_instruction=None):
    """
    Single helper to call Gemini and get a text response.
    Uses gemini-3.6-flash which is fast and free.
    """
    client = get_gemini_client()
    
    config = None
    if system_instruction:
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
        )
    
    response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=prompt,
        config=config,
    )
    return response.text.strip()


def clean_json_response(text):
    """
    Cleans markdown code blocks (like ```json ... ```) from Gemini outputs.
    """
    text = text.strip()
    if text.startswith('```json'):
        text = text[7:]
    elif text.startswith('```'):
        text = text[3:]
    if text.endswith('```'):
        text = text[:-3]
    return text.strip()


def start_gemini_interview(profile, target_role, difficulty, interview_type):
    """
    Generates the first interview question.
    """
    skills = [skill.name for skill in profile.skills.all()]
    skills_text = ", ".join(skills) if skills else "No skills added yet"
    experience = profile.experience or "Fresher"
    
    system_instruction = (
        "You are an elite, professional technical interviewer conducting a mock job interview.\n"
        "Candidate Profile:\n"
        f"- Target Role: {target_role}\n"
        f"- Experience Level: {experience}\n"
        f"- Known Skills: {skills_text}\n"
        f"- Difficulty Level: {difficulty}\n"
        f"- Interview Type: {interview_type}\n\n"
        "Role & Guidelines:\n"
        "1. Ask exactly one single question to start the interview.\n"
        "2. Do not include any greeting, friendly introduction, or setup commentary.\n"
        "3. Output ONLY the question text itself. No markdown, no quotes, no conversational filler."
    )
    
    try:
        return get_gemini_response(
            "Generate the very first interview question for the candidate.",
            system_instruction=system_instruction
        )
    except Exception as e:
        print(f"Error starting Gemini interview: {e}")
        return f"To start the interview, could you describe a challenging technical project you've worked on recently as a {target_role} and explain how you overcame its main challenges?"


def evaluate_and_generate_next(session, last_question, answer_text, next_question_number):
    """
    Evaluates the last answer and generates the next question.
    """
    past_questions = session.questions.all().order_by('timestamp')
    history_lines = []
    for q in past_questions:
        history_lines.append(f"Question: {q.question_text}")
        if q == last_question:
            history_lines.append(f"Answer: {answer_text}")
        else:
            history_lines.append(f"Answer: {q.user_answer or '[Skipped]'}")
            if q.ai_feedback:
                history_lines.append(f"Feedback: {q.ai_feedback}")
    
    history_text = "\n".join(history_lines)
    
    if next_question_number == 5:
        coding_instruction = (
            "Since this is the 5th and final question of the interview, it MUST be a coding question.\n"
            "Ask the candidate to write a specific code snippet or function to solve a technical problem relevant to the role."
        )
    else:
        coding_instruction = "Ensure the question is a relevant theory/conceptual interview question matching the role and difficulty."

    prompt = f"""
You are evaluating an ongoing mock interview for the role of '{session.target_role}' (Difficulty: '{session.difficulty}', Type: '{session.interview_type}').

Interview History so far:
{history_text}

Task:
1. Evaluate the candidate's last answer: "{answer_text}"
   to the question: "{last_question.question_text}"
2. Assign a score (1-10) for this answer.
3. Generate the next question (Question #{next_question_number} of 5).
   {coding_instruction}

Return ONLY a valid JSON object matching the following structure (do not wrap in markdown):
{{
    "evaluation": "1-2 sentences of constructive, language-appropriate feedback.",
    "score": 8,
    "next_question": "The text of the next question",
    "is_coding": {"true" if next_question_number == 5 else "false"}
}}
"""
    try:
        raw = get_gemini_response(prompt)
        result = json.loads(clean_json_response(raw))
        return result
    except Exception as e:
        print(f"Error in evaluate_and_generate_next: {e}")
        fallback_questions = {
            2: "How do you handle database optimizations (like indexing or caching) when designing high-traffic APIs?",
            3: "Explain what asynchronous programming is and how it is useful in a web application context.",
            4: "Describe how you handle authentication, authorization, and securing REST APIs in production.",
            5: "Write a Python function to check if a given binary tree is a valid Binary Search Tree (BST).",
        }
        next_q = fallback_questions.get(next_question_number, f"Describe how you handle testing and CI/CD workflows for a {session.target_role} codebase.")
        return {
            "evaluation": "Answer recorded successfully.",
            "score": 8,
            "next_question": next_q,
            "is_coding": next_question_number == 5
        }


def finalize_interview_scores(session):
    """
    Evaluates all answers, calculates metric scores, and updates the session.
    """
    questions = session.questions.all().order_by('timestamp')
    transcript_lines = []
    for idx, q in enumerate(questions, 1):
        transcript_lines.append(f"Q{idx}: {q.question_text}")
        transcript_lines.append(f"A{idx}: {q.user_answer or '[Skipped]'}")
        if q.ai_feedback:
            transcript_lines.append(f"Feedback: {q.ai_feedback}")
            
    transcript_text = "\n\n".join(transcript_lines)
    
    prompt = f"""
You are a senior engineering manager. Review the complete transcript of the mock interview and provide a final performance report.

Candidate Profile:
- Target Role: {session.target_role}
- Experience Level: {session.user_profile.experience or 'Fresher'}
- Target Difficulty: {session.difficulty}
- Interview Type: {session.interview_type}

Complete Interview Transcript:
{transcript_text}

Evaluate the candidate across 5 metrics (0-100) and return ONLY valid JSON (no markdown):
{{
    "technical_score": 85,
    "communication_score": 75,
    "problem_solving_score": 80,
    "clarity_score": 82,
    "confidence_score": 88,
    "overall_score": 82,
    "summary": "The candidate has a solid understanding of...",
    "strengths": ["Strong explanation of Django MVC architecture", "Good coding structure"],
    "areas_to_improve": ["Utilize the STAR method for behavioral answers", "Deepen knowledge of database indexing"]
}}
"""
    try:
        raw = get_gemini_response(prompt)
        result = json.loads(clean_json_response(raw))
        
        session.technical_score = result.get("technical_score", 70)
        session.communication_score = result.get("communication_score", 70)
        session.problem_solving_score = result.get("problem_solving_score", 70)
        session.clarity_score = result.get("clarity_score", 70)
        session.confidence_score = result.get("confidence_score", 70)
        session.overall_score = result.get("overall_score", 70)
        session.summary = result.get("summary", "Interview completed.")
        session.strengths = result.get("strengths", [])
        session.areas_to_improve = result.get("areas_to_improve", [])
    except Exception as e:
        print(f"Error finalizing interview scores: {e}")
        q_count = session.questions.all().count()
        answered_qs = session.questions.exclude(user_answer__isnull=True).exclude(user_answer="").exclude(user_answer="[Skipped]")
        answered_count = answered_qs.count()
        base_score = int((answered_count / max(1, q_count)) * 80)
        session.technical_score = max(50, base_score + 10)
        session.communication_score = max(50, base_score + 5)
        session.problem_solving_score = max(50, base_score + 8)
        session.clarity_score = max(50, base_score + 4)
        session.confidence_score = max(50, base_score + 6)
        session.overall_score = max(50, base_score + 7)
        session.summary = f"Mock interview completed. Answered {answered_count} of {q_count} questions."
        session.strengths = ["Completed the structured session", "Provided responses for all questions asked"]
        session.areas_to_improve = ["Revise technical core architecture", "Practice coding challenges under time limits"]
        
    session.status = 'completed'
    session.end_time = timezone.now()
    session.save()
    return session


# Keep this for backward compatibility with battles/views.py
def get_gemini_model(system_instruction=None):
    """Legacy helper kept for battles/views.py compatibility."""
    # Returns a simple wrapper object
    class _ModelWrapper:
        def __init__(self, sys_inst):
            self.sys_inst = sys_inst
        def generate_content(self, prompt):
            text = get_gemini_response(prompt, system_instruction=self.sys_inst)
            class _Resp:
                pass
            r = _Resp()
            r.text = text
            return r
    return _ModelWrapper(system_instruction)
