# Day 14 — Phase 10.1: Career DNA & Skill Analysis API

## Aaj ka goal

Frontend ke `CareerDNA.jsx` aur `SkillGaps.jsx` pages abhi `mockData.js` se chal rahe hain.  
Aaj hum **real Django APIs** banayenge jo user ki actual skills dekh kar AI se analysis karwaega.

---

## Pehle samjho — Hum kya banana chahte hain?

```
User → GET /career-dna/
         ↓
    Django view
         ↓
    User ki skills DB se fetch karo
         ↓
    Gemini AI ko prompt bhejo
         ↓
    AI returns: skill scores, career matches, personality tags
         ↓
    JSON response frontend ko
```

---

## Step 1 — service.py mein naya function banana

Humara `service.py` pehle se exist karta hai (roadmap aur chat ke liye).  
Usi file mein ek **naya function** add karenge: `analyze_career_dna()`

### Ye function kya karega?

1. User ki skills list lega
2. User ka experience aur career goal lega  
3. Gemini ko ek structured prompt bhejega
4. AI se JSON output maangega jisme:
   - `radar_data` → har skill category ka score (0-10)
   - `career_paths` → matched roles with % score
   - `personality_tags` → ["Builder", "Analytical", etc.]
   - `strengths` → user ki strong skills
   - `growth_areas` → weak skills jo improve karni hain
   - `ai_summary` → 2-3 line career analysis

### Code — `service.py` mein add karo (existing file ke end mein)

```python
def analyze_career_dna(user_profile):
    """
    User ki profile dekh kar AI se complete career DNA analysis karta hai.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key missing"}
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')

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
```

---

## Step 2 — views.py mein naya view banana

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def career_dna(request):
    """
    User ki career DNA analysis return karta hai.
    GET /career-dna/
    """
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        return Response({"status": "error", "message": "Profile not found"}, status=404)
    
    # Service function call karo
    result = analyze_career_dna(profile)
    
    if "error" in result:
        return Response({"status": "error", "message": result["error"]}, status=500)
    
    return Response({"status": "success", "data": result})
```

> **Import update karna mat bhulna** — `views.py` ke top pe ye line update karo:
> ```python
> from .service import generate_career_roadmap, interact_with_career_coach, analyze_career_dna
> ```

---

## Step 3 — urls.py mein route add karo

```python
path('career-dna/', views.career_dna, name="careerdna"),
```

---

## Step 4 — Postman se test karo

1. `POST /login/` → access token lo
2. `GET /career-dna/` header mein `Authorization: Bearer <token>` dalo
3. Response kuch aisa aana chahiye:

```json
{
    "status": "success",
    "data": {
        "radar_data": [
            {"subject": "Backend", "score": 8},
            {"subject": "Frontend", "score": 3}
        ],
        "career_paths": [
            {"role": "Backend Developer", "match": 86, "icon": "⚙️", "color": "#6366f1"}
        ],
        "personality_tags": ["Builder", "Analytical"],
        "strengths": ["Python", "Django"],
        "growth_areas": ["Docker", "Redis"],
        "readiness_score": 72,
        "ai_summary": "Strong backend foundation..."
    }
}
```

---

## Step 5 — Skill Gap API

Career DNA ke baad **Skill Gap API** banayenge. Ye thoda alag hai:

- **Career DNA** → "Tu overall kaisa hai"
- **Skill Gaps** → "Ek specific role ke liye teri kya kami hai"

### Naya service function: `analyze_skill_gaps(user_profile, target_role)`

```python
def analyze_skill_gaps(user_profile, target_role="Backend Developer"):
    """
    User ki skills aur target role ke beech ka gap calculate karta hai.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key missing"}
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')

    skills = [skill.name for skill in user_profile.skills.all()]
    skills_text = ", ".join(skills) if skills else "None"

    prompt = f"""
You are a Career Skills Analyst. Compare this student skills against requirements for the role: "{target_role}".

Student current skills: {skills_text}

Return ONLY valid JSON (no markdown) in this exact format:
{{
    "target_role": "{target_role}",
    "skill_gaps": [
        {{
            "name": "Docker",
            "category": "DevOps",
            "current": 2,
            "required": 7,
            "gap": 5,
            "priority": "high",
            "reason": "Docker is essential for deploying {target_role} applications in production."
        }}
    ]
}}

Priority rules:
- gap >= 5 → "high"
- gap 3-4 → "medium"
- gap <= 2 → "low"

Return 6-8 skills total covering: languages, frameworks, tools, and concepts needed for {target_role}.
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
```

### Naya view: `skill_gaps`

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def skill_gaps(request):
    """
    User ki skill gaps return karta hai given target role ke liye.
    GET /skill-gaps/?role=Backend+Developer
    """
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        return Response({"status": "error", "message": "Profile not found"}, status=404)
    
    # URL query param se role lo, default Backend Developer
    target_role = request.query_params.get('role', 'Backend Developer')
    
    result = analyze_skill_gaps(profile, target_role)
    
    if "error" in result:
        return Response({"status": "error", "message": result["error"]}, status=500)
    
    return Response({"status": "success", "data": result})
```

### Import update karo (views.py top pe):
```python
from .service import (
    generate_career_roadmap,
    interact_with_career_coach,
    analyze_career_dna,
    analyze_skill_gaps
)
```

### URL add karo:

```python
path('skill-gaps/', views.skill_gaps, name="skillgaps"),
```

### Test karo:
```
GET /skill-gaps/                           → Backend Developer (default)
GET /skill-gaps/?role=AI+Engineer          → AI Engineer ke liye
GET /skill-gaps/?role=Full+Stack+Developer → Full Stack ke liye
```

---

## Final URLs list (updated urls.py)

```python
urlpatterns = [
    # ... existing routes ...
    path('career-dna/', views.career_dna, name="careerdna"),
    path('skill-gaps/', views.skill_gaps, name="skillgaps"),
]
```

---

## Summary: Aaj ke 2 APIs

| API | Method | URL | Kya karta hai |
|-----|--------|-----|---------------|
| Career DNA | GET | `/career-dna/` | Radar data, career matches, personality tags, AI summary |
| Skill Gaps | GET | `/skill-gaps/?role=...` | Specific role ke skill gap list with priority |

---

## Kaam karne ka order (step by step)

```
1. service.py kholо → analyze_career_dna() add karo (file ke end mein)
2. service.py mein → analyze_skill_gaps() add karo (uske baad)
3. views.py kholо → career_dna view add karo
4. views.py mein → skill_gaps view add karo
5. views.py top pe → imports update karo
6. urls.py mein → dono routes add karo
7. Terminal: python manage.py runserver
8. Postman: pehle career-dna test karo, phir skill-gaps
```

---

## Common Mistakes Se Bachna

| Mistake | Solution |
|---------|----------|
| `json.loads()` fail → JSONDecodeError | Cleaning code daala hai — markdown backticks remove karta hai |
| Import bhulna | `from .service import analyze_career_dna, analyze_skill_gaps` |
| `@permission_classes` bhulna | Unauthenticated users access kar payenge |
| Server restart bhulna | `urls.py` change ke baad restart zaroori |
| AI ne extra text add kiya response mein | `text.strip()` + backtick removal se handle hota hai |

---

## Interview Questions — Day 14

**Q1. `@api_view(['GET'])` decorator kya karta hai?**
> Ye Django function view ko DRF ka REST API view bana deta hai. Iske bina `Response` object theek se kaam nahi karta aur HTTP method restriction nahi hoti. `['GET']` batata hai sirf GET allowed hai — POST karne par `405 Method Not Allowed` milega.

**Q2. `request.query_params.get('role', 'Backend Developer')` kya karta hai?**
> URL ke `?role=AI+Engineer` part se `role` ki value nikalta hai. Agar `role` nahi diya toh default `'Backend Developer'` use hoga. DRF mein `query_params` preferred hai, `request.GET.get()` bhi same kaam karta hai.

**Q3. AI response ko parse karne se pehle cleaning kyon zaroori hai?**
> Gemini kabhi kabhi response ko markdown code block mein wrap kar deta hai — jaise ` ```json ... ``` `. Agar seedha `json.loads()` karein toh `JSONDecodeError` aayega. Isliye pehle `startswith` check karke backticks strip karte hain.

**Q4. Career DNA aur Skill Gap API mein fundamental difference kya hai?**
> Career DNA holistic view deta hai — "tera overall profile kaisa hai, teri strengths kya hain." Skill Gap role-specific hai — "Backend Developer banne ke liye teri kahan kami hai." Dono milkar user ko answer dete hain: _Where am I? What should I do next? Why?_

**Q5. `request.query_params` vs `request.data` mein kya fark hai?**
> `query_params` → URL ke `?key=value` part se aata hai (GET requests mein)
> `request.data` → Request body se aata hai (POST/PUT ke JSON ya form data mein)

**Q6. Agar user ne koi skill add nahi ki toh API crash kyun nahi karegi?**
> Service function mein check daala hai:
> `skills_text = ", ".join(skills) if skills else "No skills added yet"`
> Agar empty list hai toh AI ko bataya jaata hai ki no skills added — AI phir bhi generic analysis return karta hai.
