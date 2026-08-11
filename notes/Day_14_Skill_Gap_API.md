# Day 14 — Phase 10.2: Skill Gap API

## Aaj ka goal

`SkillGaps.jsx` abhi `mockSkillGaps` se chal raha hai.  
Hum **real Django API** banayenge: `GET /skill-gaps/?role=Backend+Developer`

---

## Pehle samjho — Career DNA vs Skill Gap ka fark

```
Career DNA  → "Tu overall kaisa hai?"
              Radar chart, career matches, personality tags

Skill Gap   → "Ek specific role ke liye teri kya kami hai?"
              Har skill ka current level vs required level
              Priority: High / Medium / Low
```

---

## Backend Part

### Step 1 — `service.py` mein function add karo

Existing `service.py` file ke **end mein** yeh function paste karo  
(`analyze_career_dna` ke baad):

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
```

---

### Step 2 — `views.py` mein view add karo

> ⚠️ **Important Design Decision**
>
> `target_role="Backend Developer"` as default **galat** hai — kyunki har user ka goal alag hota hai.
> Iski jagah hum **3-level priority system** use karte hain:
> 1. URL `?role=` param → user ne manually switch kiya
> 2. Profile ka career goal → user ka actual target
> 3. `"Software Developer"` → last resort fallback

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def skill_gaps(request):
    """
    User ki skill gaps return karta hai.
    GET /skill-gaps/               → Profile ke career goal se role auto-pick
    GET /skill-gaps/?role=AI+Engineer → Manually override karo
    """
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        return Response({"status": "error", "message": "Profile not found"}, status=404)

    # Smart role selection — 3 level priority
    if request.query_params.get('role'):
        # Level 1: User ne manually URL mein role diya
        target_role = request.query_params.get('role')
    elif profile.user_career_goals.exists():
        # Level 2: Profile ka saved career goal use karo
        target_role = profile.user_career_goals.last().title
    else:
        # Level 3: Koi goal nahi — generic fallback
        target_role = "Software Developer"

    result = analyze_skill_gaps(profile, target_role)

    if "error" in result:
        return Response({"status": "error", "message": result["error"]}, status=500)

    return Response({
        "status": "success",
        "data": result,
        "used_role": target_role   # Frontend ko batao kaun sa role use hua
    })
```

> **Import update karo** — `views.py` ka top:
> ```python
> from .service import generate_career_roadmap, interact_with_career_coach, analyze_career_dna, analyze_skill_gaps
> ```

> **`service.py` mein default remove karo** — caller ki responsibility hai role dena:
> ```python
> # Pehle (wrong default):
> def analyze_skill_gaps(user_profile, target_role="Backend Developer"):
>
> # Sahi:
> def analyze_skill_gaps(user_profile, target_role):
> ```

---

### Step 3 — `urls.py` mein route add karo

```python
path('skill-gaps/', views.skill_gaps, name="skillgaps"),
```

---

### Step 4 — Postman se test karo

```
GET /skill-gaps/
Authorization: Bearer <token>
```

Query params ke saath:
```
GET /skill-gaps/?role=AI+Engineer
GET /skill-gaps/?role=Full+Stack+Developer
GET /skill-gaps/?role=Data+Scientist
```

Expected response:
```json
{
    "status": "success",
    "data": {
        "target_role": "Backend Developer",
        "overall_gap_score": 65,
        "skill_gaps": [
            {
                "id": 1,
                "name": "Docker",
                "category": "DevOps",
                "current": 2,
                "required": 7,
                "gap": 5,
                "priority": "high",
                "reason": "Docker is essential..."
            }
        ]
    }
}
```

---

## Frontend Part — `SkillGaps.jsx` update

### Abhi kya ho raha hai (mock):
```js
import { mockSkillGaps } from '../data/mockData';
// hardcoded data use ho raha hai
```

### Hum kya karenge (real API):

```js
// Top mein import karo
import { useState, useEffect } from 'react';
import api from '../api';

// Component ke andar state banao
const [gaps, setGaps] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedRole, setSelectedRole] = useState('Backend Developer');

// API call
const fetchSkillGaps = async (role) => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.get(`/skill-gaps/?role=${encodeURIComponent(role)}`);
    if (res.data?.status === 'success') {
      setGaps(res.data.data.skill_gaps);
    } else {
      setError('Failed to load skill gaps');
    }
  } catch (err) {
    setError('Could not reach server. Showing demo data.');
  } finally {
    setLoading(false);
  }
};

// Mount pe aur role change pe call karo
useEffect(() => {
  fetchSkillGaps(selectedRole);
}, [selectedRole]);
```

### Role switcher buttons:

```jsx
{/* Ye buttons se role change hoga aur API re-call hogi */}
<div className="flex gap-2 flex-wrap">
  {['Backend Developer', 'Full Stack Developer', 'AI Engineer', 'Data Scientist'].map(role => (
    <button
      key={role}
      onClick={() => setSelectedRole(role)}
      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
        selectedRole === role
          ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
          : 'border border-[#1a1a25] text-[#55556a] hover:text-white'
      }`}
    >
      {role}
    </button>
  ))}
</div>
```

### Data use kaise karo:

```jsx
// Render mein: real data ya mock fallback
const displayGaps = gaps.length > 0 ? gaps : mockSkillGaps;

// Map karte waqt
{displayGaps.map((skill, i) => (
  <SkillGapCard key={skill.id || i} skill={skill} />
))}
```

---

## Flow Diagram — Skill Gap API

```
User selects role → React state update
        ↓
fetchSkillGaps('AI Engineer') called
        ↓
GET /skill-gaps/?role=AI+Engineer (with JWT token)
        ↓
Django view → request.query_params.get('role')
        ↓
analyze_skill_gaps(profile, 'AI Engineer')
        ↓
Gemini compares user skills vs AI Engineer requirements
        ↓
JSON: [{name, current, required, gap, priority, reason}]
        ↓
React renders animated skill bars
```

---

## Kaam karne ka order (Backend pehle, Frontend baad)

```
Backend:
1. service.py → analyze_skill_gaps() paste karo
2. views.py   → skill_gaps view add karo + import update
3. urls.py    → path add karo
4. Server restart karo
5. Postman test karo

Frontend:
6. SkillGaps.jsx mein useState, useEffect, api import karo
7. fetchSkillGaps function banao
8. selectedRole state banao
9. Role switcher buttons add karo
10. displayGaps = real data ya mock fallback
11. Browser mein test karo
```

---

## Common Mistakes

| Mistake | Solution |
|---------|----------|
| Space wala role URL mein break hoga | `encodeURIComponent(role)` use karo |
| Import bhulna | `analyze_skill_gaps` service se import karo |
| Role ke saath `+` ya `%20` | `encodeURIComponent` dono handle karta hai |
| AI ne extra fields add kiye | `.skill_gaps` se direct array lo |

---

## Interview Questions — Skill Gap API

**Q1. `request.query_params.get('role', 'Backend Developer')` mein default value kyon di?**
> Agar user ne `?role=...` nahi diya URL mein toh API crash nahi karegi — default role ke saath kaam karegi. Ye defensive programming ka basic principle hai.

**Q2. Frontend mein `encodeURIComponent(role)` kyon use kiya?**
> Role names mein spaces hain — jaise "Backend Developer". URL mein space allowed nahi hota. `encodeURIComponent` "Backend Developer" ko "Backend%20Developer" mein convert karta hai jo valid URL hai.

**Q3. `useEffect` mein `[selectedRole]` dependency array kyon hai?**
> Jab bhi `selectedRole` ki value change hogi, `useEffect` dobara run hoga aur naya API call hoga. Agar empty `[]` dete toh sirf mount pe ek baar hi call hota.

**Q4. Real data nahi aaya toh mock data kaise show karein?**
> ```js
> const displayGaps = gaps.length > 0 ? gaps : mockSkillGaps;
> ```
> Agar `gaps` empty hai (API fail hui), toh `mockSkillGaps` use ho jaata hai. User ko error nahi dikhti — graceful degradation.

**Q5. `overall_gap_score` API mein kyon add kiya?**
> Ek single number jo batata hai user kitna ready hai us specific role ke liye — 100 means fully ready, 0 means bahut kuch seekhna hai. Ye dashboard mein "Backend Developer: 65% ready" jaisi meaningful metric ke roop mein use ho sakta hai.
