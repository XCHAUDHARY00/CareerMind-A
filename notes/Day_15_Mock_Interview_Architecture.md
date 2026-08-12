# Day 15: AI Mock Interview Architecture & System Design 🎤

## 📌 Context & Concept Summary
Bhai, **Mock Interview AI** platform ka interactive flagship module hai. Yeh user se real-time technical questions puchta hai, audio/speech-to-text input receive karta hai, responses ko depth & clarity par score karta hai, aur dynamic follow-up questions generate karta hai.

---

## 🛠️ Architecture Flow
```
[User Mic Input / Text] ──(Web Speech API)──> [Frontend State]
                                                   │
                                     POST /api/interview/answer/
                                                   │
[Django Backend] <─────────────────────────────────┘
       │
       ├──> Fetch previous session questions from DB (InterviewQuestion table)
       ├──> Append context to Gemini Prompt ("Don't repeat past questions")
       ├──> Call Gemini API (gemini-flash-latest)
       └──> Save AI Feedback + Next Question to DB and return to Client
```

---

## 💻 Database Models (`models.py`)
```python
class InterviewSession(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='interview_sessions')
    target_role = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50, default='Medium')
    status = models.CharField(max_length=50, default='ongoing') # ongoing, completed
    technical_score = models.IntegerField(null=True, blank=True)
    communication_score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class InterviewQuestion(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    user_answer = models.TextField(null=True, blank=True)
    ai_feedback = models.TextField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
```

---

## ❓ 10 In-Depth Technical Interview Questions & Answers

### Q1: LLM ko stateless requests ke dauran interview ka context (memory) kaise diya jata hai taaki questions repeat na ho?
**Detailed Answer (Bhai Language):** 
Bhai, LLMs (Gemini/OpenAI) by default **Stateless** hote hain — matlab unhe har request me purani baatein yaad nahi rehti. Context maintain karne ke liye hum Database-driven Windowed Context pattern use karte hain:
1. Jab user `POST /api/interview/answer/` hit karta hai, tab hum DB table `InterviewQuestion` se current `session_id` ke pichle saare questions aur answers fetch karte hain.
2. System Instruction prompt me list append kar dete hain:
   ```text
   Previous Questions Asked in this Session:
   1. What is GIL in Python? (User Answer: Global Interpreter Lock...)
   2. Explain indexing in PostgreSQL. (User Answer: B-Tree index...)
   
   Instruction: Evaluate the last answer out of 100. Do NOT repeat any previous questions. Ask the NEXT technical question.
   ```
3. Iss tarah LLM har step par previous chat context dekh kar natural, non-repeating, progressive interview conduct karta hai.

---

### Q2: Audio file server par bhejne ki jagah Browser Web Speech API (`webkitSpeechRecognition`) kyu use kiya?
**Detailed Answer (Bhai Language):** 
1. **Network Latency & Bandwidth**: Audio files (.mp3/.wav 5MB-10MB) send karne se network payload heavy hota hai aur round-trip time 3-5 seconds lag jata hai. Speech-to-Text browser-side execute karne par server par sirf tiny JSON string (`"My answer is..."`) pass hoti hai (latency drops to < 50ms).
2. **Server Cost Optimization**: Backend par Whisper/Deepgram STT models run karna highly GPU-intensive aur expensive hota hai. Client-side browser native Web Speech API 100% free hoti hai!

---

### Q3: Anti-Cheating & Tab Switching Prevention Mechanism system me kaise works karta hai?
**Detailed Answer (Bhai Language):** 
Frontend JavaScript me HTML5 Page Visibility API attach hoti hai:
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    warningCount.current += 1;
    alert("Warning: Tab switching is strictly prohibited during the AI Mock Interview!");
    if (warningCount.current >= 2) {
      autoTerminateInterviewSession();
    }
  }
});
```
Agar candidate kisi aur tab par Google search karne jaata hai, to `document.hidden` flag `true` ho jaata hai, browser warning issue karta hai, aur 2nd attempt par session automatically terminate hokar scorecard save kar deta hai.

---

### Q4: LLM API call fail ya network drop hone par interview state corruption kaise roki jaati hai?
**Detailed Answer (Bhai Language):** 
Database Transactions (`@transaction.atomic`) aur Session Idempotency use karke:
- User ka submit kiya hua answer DB me transaction open hone par pehle save hota hai.
- Agar Gemini API call fail ya timeout (`HTTP 504`) hoti hai, to database changes rollback ho jaate hain ya question `pending` state me raheta hai.
- Frontend Axios interceptor error catch karke user ko **"Retry Answer"** button dikhata hai without creating duplicate questions.

---

### Q5: Dynamic Question Difficulty Escalation (Adaptive Testing) kaise work karta hai?
**Detailed Answer (Bhai Language):** 
Agar Candidate pehle 2 questions ka answer high quality (>85/100) deta hai, to System Prompt dynamically difficulty adjust karta hai:
$$\text{Next Difficulty} = \begin{cases} \text{Hard / Advanced Architecture}, & \text{if Avg Score } \ge 80 \\ \text{Medium / Core Logic}, & \text{if } 50 \le \text{Avg Score} < 80 \\ \text{Fundamental / Basic Concept}, & \text{if Avg Score } < 50 \end{cases}$$
Isse candidate ki exact technical boundary accurately test ho jaati hai.

---

### Q6: Interview completion scorecard rating algorithm ($1-100$) kaise calculate hoti hai?
**Detailed Answer (Bhai Language):** 
Session ke end par (`/api/interview/end/`), backend DB se saare questions ke individual ratings fetch karke aggregate scores compute karta hai:
$$\text{Technical Score} = \frac{1}{N} \sum_{i=1}^{N} \text{QuestionScore}_i$$
$$\text{Communication Score} = \text{Gemini Evaluation}(\text{Vocabulary Depth}, \text{Conciseness}, \text{Clarity})$$

---

### Q7: Micro-Services Scaling me simultaneous thousands of mock interviews handling kaise hogi?
**Detailed Answer (Bhai Language):** 
Django WSGI request handlers ko **Asynchronous Task Queue (Celery + Redis)** me refactor karke. Fast API response return karke background worker thread me AI response process kiya jata hai, aur WebSockets (Django Channels) se client screen par stream kar diya jata hai.

---

### Q8: High-frequency API calls se Gemini Rate Limit Exhaustion kaise avoid hota hai?
**Answer (Bhai Language):** 
`gemini-flash-latest` model use karke jinki RPM (Requests Per Minute) quotas high hoti hai. Saath me backend User Rate Limiter (`30 requests/minute`) enforces limits per user session.

---

### Q9: Real-time Audio synthesis (AI Speaking back to User) kaise implement hota hai?
**Answer (Bhai Language):** 
Browser Native SpeechSynthesis API se:
```javascript
const utterance = new SpeechSynthesisUtterance(questionText);
utterance.rate = 1.0;
window.speechSynthesis.speak(utterance);
```
Isse AI Question screen par aate hi browser voice me auto-read karke bolta hai.

---

### Q10: Candidate response length truncation attack se database blowup kaise roka jata hai?
**Answer (Bhai Language):** 
DRF Serializer validator rule: `answer_text = serializers.CharField(max_length=2000)`. Max 2,000 chars accept kiye jaate hain, preventing oversized string memory injection.
