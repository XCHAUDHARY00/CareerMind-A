# Day 23: Security and Environment Hardening 🛡️

## 📌 Context & Concept Summary
Bhai, kitna bhi sundar app ho, agar API Keys leak ho gayi ya SQL Injection se DB wipped out ho gaya to pura project destroyed. Is module me humne CareerMind AI application ko Production Security Standards ke mutabiq harden kiya.

---

## 🛠️ Security Architecture Pillars

1. **Environment Isolation**: Production Secrets (`SECRET_KEY`, `GEMINI_API_KEY`, `SUPABASE_DB_URL`) ko `.env` file me encapsulate karke `.gitignore` me force add kiya.
2. **CORS (Cross-Origin Resource Sharing)**: `django-cors-headers` se strict trusted origins (`ALLOWED_HOSTS` & `CORS_ALLOWED_ORIGINS`) map kiye.
3. **SQL Injection Defense**: Django ORM Parameterized SQL queries automatically SQL injection attacks neutralize kar deti hain.
4. **XSS & Content Security**: Input sanitization & Django CSRF / JWT headers enforcement.

---

## 💻 Environment Setup (`settings.py`)
```python
import os
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Security Headers for HTTPS
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

---

## ❓ 10 Technical Interview Questions & Answers

### Q1: API Key `.env` me rakhna GitHub public repo push risk se kaise bachata hai?
**Answer:** `.gitignore` file `.env` ko commit hash list se exclude kar deti hai, jisse source control me private keys track ya upload nahi hoti.

### Q2: Django ORM SQL Injection se protect kaise karta hai?
**Answer:** Django ORM raw SQL strings concat karne ki jagah SQL Parameter Binding (`WHERE username = %s`) use karta hai, jisse input parameters text string treat hote hain, executable SQL command nahi.

### Q3: CORS preflight request (`OPTIONS`) kya hoti hai aur kab trigger hoti hai?
**Answer:** Non-simple HTTP requests (jaise Authorization Bearer Header, Content-Type: application/json) ke liye browser pehle lightweight `OPTIONS` request bhejta hai server origin permission verify karne ke liye.

### Q4: XSS (Cross-Site Scripting) attack kya hota hai aur application me kaise block hota hai?
**Answer:** Attacker client browser me malicious JS script inject kar deta hai. React output rendering automatic HTML entity escaping karti hai, jisse JS text treat hoti hai na ki executable script.

### Q5: CSRF (Cross-Site Request Forgery) attacks Token-based JWT APIs par apply hote hain?
**Answer:** Agar JWT `Authorization: Bearer <token>` header me bheja jata hai, to browser default behavior auto-cookie attach nahi karta, preventing CSRF attacks.

### Q6: `DEBUG = True` Production Environment me leave karna danger kyu hai?
**Answer:** Exception stack trace Full Source Code lines, Local Variable contents, Environment Variables, Database Settings expose kar deta hai (Serious Information Disclosure).

### Q7: Content-Type Options `nosniff` header kya protect karta hai?
**Answer:** Browser ko MIME-type sniffing karne se rokta hai, jisse text/plain file application/javascript ki tarah execute nahi hoti.

### Q8: Clickjacking Attack kya hota hai aur `X-Frame-Options: DENY` isko kaise rokta hai?
**Answer:** Attacker invisible `<iframe>` me target site render karke user touches hijack karta hai. `DENY` header browser ko webpage kisi frame me render karne se block karta hai.

### Q9: Database Password Storage me Plain Text vs Hashing (PBKDF2/Bcrypt) kyu mandatory hai?
**Answer:** Django PBKDF2 algorithm with SHA256 use karta hai with unique Salt per user. DB compromise hone par bhi original passwords reverse engineer nahi ho sakte.

### Q10: Rate Limiting API abuse and Brute-force Password Guesses ko kaise rokta hai?
**Answer:** IP/User throttle limits set karke (e.g. max 5 login attempts per minute). Limits exceed hone par 429 Too Many Requests return kiya jata hai.
