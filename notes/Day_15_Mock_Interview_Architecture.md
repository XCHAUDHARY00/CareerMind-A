# Day 15: AI Mock Interview Architecture & API Design

Bhai, jaisa tune decide kiya hai, **Mock Interview ka backend code tu khud likhega!** 🔥 Yeh note tera guide hai. Isme hum API design, logic flow aur interview questions cover karenge taaki tu code likhte waqt clear rahe.

---

## 🏗️ 1. Database Modeling (models.py)

Tujhe Django me do models banane honge:

1.  **`InterviewSession`**:
    *   Jo ek particular interview ko track karega.
    *   Fields: `user` (ForeignKey), `start_time`, `end_time`, `status` (ongoing, completed, terminated), `technical_score`, `communication_score`.
2.  **`InterviewQuestion`**:
    *   Ek session ke andar jitne questions puche gaye.
    *   Fields: `session` (ForeignKey), `question_text` (Jo AI ne pucha), `user_answer` (Jo text browser ne bheja), `is_coding` (Boolean), `ai_feedback` (Sahi tha ya galat).

---

## 🔌 2. API Endpoints Design (views.py)

Tujhe 3 APIs banani hain.

### A. `POST /api/interview/start/`
*   **Request:** `{ "target_role": "Backend Developer" }`
*   **Action:** 
    1. Ek naya `InterviewSession` DB me create kar.
    2. Gemini AI ko prompt de: *"User is a Backend Developer. Ask the very first technical question to start the interview. Output ONLY the question."*
    3. Ek `InterviewQuestion` create kar jisme AI ka question save ho.
*   **Response:** `{ "session_id": 1, "first_question": "What is the difference between a process and a thread?" }`

### B. `POST /api/interview/answer/`
*   **Request:** `{ "session_id": 1, "answer_text": "A process has its own memory space..." }`
*   **Action:**
    1. `InterviewQuestion` me `user_answer` update kar.
    2. Session check kar ki kitna time ho gaya hai aur kitne questions puch liye hain.
    3. Gemini AI ko pichla question aur answer bhej, aur prompt de: *"Evaluate this answer out of 10. Also generate the NEXT question. If we have asked 5 theory questions, generate a coding question next."*
    4. Pichle question ka `ai_feedback` save kar. Naya `InterviewQuestion` create kar naye question ke sath.
*   **Response:** `{ "next_question": "Can you write a SQL query to find the second highest salary?", "is_coding": true }`

### C. `POST /api/interview/end/`
*   **Request:** `{ "session_id": 1 }`
*   **Action:**
    1. Session ko 'completed' mark kar.
    2. Saare `InterviewQuestion` ko AI me bhej kar ek final rating (1-100) nikal technical aur communication ke liye.
    3. Score ko `InterviewSession` me save kar de.
*   **Response:** `{ "technical_score": 85, "communication_score": 75, "summary": "Good concepts but need practice in SQL." }`

---

## 🎤 3. Frontend Web Speech API (Browser Native)

Frontend par tujhe koi third-party library nahi chahiye voice ke liye. Browser me natively `webkitSpeechRecognition` hota hai. 
Jab frontend code likhega toh yeh flow hoga:
1. User **"Hold to Speak"** dabayega.
2. Mic on hoga, user bolega.
3. Jab release karega, SpeechRecognition us audio ko text me dega.
4. Wo text seedha `POST /api/interview/answer/` (API B) me chala jayega. 

---

## 🧠 4. Interview Questions on This Architecture

Yeh feature kaafi complex hai, toh interview me iske upar direct system design questions aa sakte hain.

### Q1. How do you maintain the context (memory) of the interview so the AI doesn't repeat questions?
**Answer:** "Har `POST /api/interview/answer/` call par main backend se us session ke pichle 2-3 questions aur answers nikal kar AI ke prompt me bhejunga (Prompt: 'Here is the chat history... don't ask these again. Ask the next question.'). Hum DB se history utha kar LLM ko context pass karte hain."

### Q2. Why did you use the Browser's Web Speech API instead of sending audio to the backend?
**Answer:** "Sending audio files over HTTP takes more bandwidth, increases latency (lag), and requires expensive backend STT (Speech-to-Text) models like Whisper. Browser's native API converts speech to text on the client-side for free, and I only send a tiny text payload to my backend. It's highly optimized for real-time web apps."

### Q3. How do you prevent users from cheating (Googling answers)?
**Answer:** "On the frontend, I enforce Fullscreen mode using the `Fullscreen API`. I also attach an event listener to the `visibilitychange` event. If `document.hidden` becomes true (meaning the user switched tabs or minimized the browser window), I fire a warning, and on the second attempt, I terminate the interview by calling the `/api/interview/end/` endpoint."

### Q4. If the LLM takes 3-4 seconds to generate the next question, how do you handle the UX?
**Answer:** "During the API call, the frontend shows a 'thinking...' skeleton or an AI animation. Since the AI evaluates the previous answer AND generates the next question in a single call, it's efficient, but to mask the delay, we use loading states."

### Q5. What happens if the internet disconnects during the interview?
**Answer:** "The session state is stored in the database. If a request fails, the frontend can catch the Axios error and show a 'Network Error: Retry' button. When the user retries, it sends the answer again to the same `session_id`."

---
**Tera Task:** Ab tu backend me `models.py` aur `views.py` me APIs likhna shuru kar. Main tere questions/doubts solve karunga!
