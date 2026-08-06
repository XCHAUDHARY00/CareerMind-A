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
