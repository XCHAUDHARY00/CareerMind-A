# 📅 DAY 1: Database Migrations & Django Admin

## 1. Migrations (The Translator) 🗣️

**Concept:** 
Python ko SQL nahi aati, aur Database (PostgreSQL) ko Python nahi aati. 
Hum apna data structure `models.py` mein Python mein likhte hain (e.g., `class UserProfile(models.Model)`).

**Why we need it?**
Database mein tables (rows & columns) create karne ke liye humein ek "translator" chahiye jo hamare Python code ko SQL commands mein badal de.

**How it works?**
- `makemigrations`: Ye command tumhare `models.py` ko check karti hai aur ek instruction file banati hai (jaise ek blueprint).
- `migrate`: Ye command us blueprint ko padhti hai aur actual database (PostgreSQL) mein jaakar tables create kar deti hai.

**Real-life example:**
Maan lo tumhe ghar banana hai.
`models.py` = Tumhara idea.
`makemigrations` = Architect jo us idea ka naksha (blueprint) banata hai.
`migrate` = Builder jo nakshe ko dekh kar actual ghar (database table) banata hai.

---

## 2. Django Admin (The Dashboard) 🎛️

**Concept:**
Django ek free, built-in admin panel deta hai jahan se hum apne database ka sara data dekh sakte hain, add kar sakte hain, aur delete kar sakte hain—bina koi code likhe!

**Why we need it?**
Jab hum development kar rahe hote hain, toh baar-baar database terminal open karke SQL query likhna mushkil hota hai. Admin panel humein ek UI de deta hai database manage karne ke liye.

**How to use it:**
1. Pehle humein ek **Superuser** (Boss account) banana padta hai using `python manage.py createsuperuser`.
2. Phir humein apne models ko admin ko sikhana padta hai (Register karna) taaki wo admin panel mein dikhein.
   
```python
# users/admin.py
from django.contrib import admin
from .models import UserProfile

admin.site.register(UserProfile) # Admin panel ko batana ki UserProfile bhi dikhana hai
```

---

## ✅ Checklist for Day 1
- [ ] Activate Virtual Environment: `sourcevenv/bin/activate` (Mac/Linux)
- [ ] Connect PostgreSQL (Done via `.env`)
- [ ] Run `python manage.py makemigrations`
- [ ] Run `python manage.py migrate`
- [ ] Create superuser using `python manage.py createsuperuser`
- [ ] Register `UserProfile` in `users/admin.py`
- [ ] Login to `127.0.0.1:8000/admin` and verify

---

## 🐛 Common Errors & Fixes (Dependency Hell)

**Error 1:** `ModuleNotFoundError: No module named 'corsheaders'`
**Why:** A third-party package mentioned in `settings.py` was not installed in the virtual environment.
**Fix:** `pip install django-cors-headers`

**Error 2:** `ImportError: cannot import name 'cc_delim_re' from 'django.utils.cache'`
**Why:** Installed a Django version that is *too new* (e.g. Django 6.1) which removed a function that Django REST Framework (DRF) relies on.

**Error 3:** `AttributeError: 'super' object has no attribute 'dicts'` (on Django 5.1)
**Why:** The installed Django version is *too old* for the very latest Python version (Python 3.14). Python 3.14 changed how `super()` works internally, causing Django 5.1 to crash in the admin panel.
**The "Goldilocks" Fix:** When 5.1 is too old for Python 3.14, and 6.1 is too new for DRF, we find the middle ground! `pip install django==6.0` fixes both issues perfectly.

---

## 🎤 TOP 10 INTERVIEW QUESTIONS (Database, Migrations & Django Basics)

**Q1. Django framework kis architecture pattern par based hai?**
**Ans:** Django MVT (Model-View-Template) architecture par based hai, jo MVC (Model-View-Controller) ka hi ek variant hai. Isme Controller ka kaam Django khud karta hai, Model database handle karta hai, View business logic likhta hai, aur Template frontend render karta hai.

**Q2. `makemigrations` aur `migrate` me kya farq hai?**
**Ans:** `makemigrations` tumhare `models.py` ke changes ko detect karke ek migration file (blueprint) banata hai. `migrate` us migration file ko execute karke actual database me tables, columns ya changes apply karta hai.

**Q3. Virtual Environment kyu banaya jata hai Python project me?**
**Ans:** Virtual Environment ek isolated folder hota hai jisme project ke dependencies (libraries) install hote hain. Isse global system Python clean rehta hai aur alag-alag projects me version conflicts nahi aate (e.g., ek project me Django 3.x chahiye aur dusre me Django 6.x).

**Q4. Django Admin panel kya hai aur iska fayda kya hai?**
**Ans:** Django Admin ek built-in, ready-to-use web interface hai jisse hum database ke records ko Create, Read, Update, aur Delete (CRUD) kar sakte hain bina kisi extra code ke. Ye internal content management ke liye bohot useful hai.

**Q5. Django me Superuser kya hota hai?**
**Ans:** Superuser ek highest privilege user account hota hai (root user ki tarah). Iske paas admin panel aur database records ka full access hota hai. Command: `python manage.py createsuperuser`.

**Q6. ORM (Object-Relational Mapping) kya hai aur Django me iska kya role hai?**
**Ans:** ORM ek technique hai jisme hum database tables ko object-oriented classes (Python) ke roop me define karte hain. Humein complex SQL queries likhne ki zaroorat nahi hoti, Django ka ORM Python objects ko automatically SQL queries me convert kar deta hai.

**Q7. Kya hum Django me PostgreSQL ke alawa koi aur database use kar sakte hain?**
**Ans:** Haan, Django by default SQLite use karta hai. Lekin hum `settings.py` me configuration change karke PostgreSQL, MySQL, Oracle jese kisi bhi relational database ko connect kar sakte hain.

**Q8. `.env` file kyu use ki jati hai project me?**
**Ans:** `.env` (Environment variables) file me hum sensitive information (jaise database password, API keys, Secret keys) hide karke rakhte hain. Ise Git par upload nahi kiya jata (added in `.gitignore`) taaki security maintain rahe.

**Q9. Agar main `models.py` me koi field delete kar du, toh kya wo database se apne aap hat jayegi?**
**Ans:** Nahi, database se automatically nahi hategi. Humein pehle `makemigrations` run karke update record karna hoga, aur uske baad `migrate` chala kar use database par apply karna hoga.

**Q10. `models.Model` class se inherit kyu karte hain Models ko?**
**Ans:** Jab hum kisi class ko `models.Model` se inherit karte hain, toh Django samajh jata hai ki ye ek database table hai, aur use saari in-built ORM functionalities (jaise `.save()`, `.objects.all()`) free me mil jati hain.
