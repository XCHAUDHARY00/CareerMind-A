# 📅 DAY 5: User Registration (Sign Up) API 🚀

Bhai, humne Login API aur JWT VIP Guard successfully bana liya hai. Lekin socho, kya har baar naya user banane ke liye humein Admin panel kholna padega? Nahi na! 

Humein ek aisi API chahiye jahan koi bhi naya banda apna username aur password daale, aur hamara backend uska naya account bana de. Isko **Registration API (Sign Up)** bolte hain.

---

## 1. Registration Login se alag kyu hai? 🧠

Login ke time par humne koi view nahi likha kyunki `simplejwt` ne apna bana-banaya view de diya tha. Par Registration hamara apna custom logic hota hai. 
Humein ek naya User database mein save karna hota hai. Lekin yahan ek sabse bada rule hai:

**SECURITY RULE:** Tum kisi ka bhi password database mein direct (plain text) save nahi kar sakte! Agar database hack ho gaya toh sabke passwords chori ho jayenge. Isliye hum password ko hamesha **"Hash"** karte hain (jaise `password123` ban jata hai `ak$#ldjflksjdf345sdf`).

Jab hum Django mein User save karte hain, toh humein Django ka built-in `create_user` method ya `set_password` use karna hota hai.

---

## 2. Steps to build Registration API 🛠️

Hum isko 3 hisso mein todenge:
1. **Serializer:** Ek naya serializer banayenge jo sirf Registration ke liye hoga. Wo user se username, email aur password lega.
2. **View:** Ek POST API banayenge (jisme Guard NAHI hoga, open for all) jo data ko le kar save karega.
3. **URL:** Usko `/api/register/` se link karenge.

---

## 3. Understanding the Serializer Code 🕵️‍♂️

Tumne `UserRegistrationSerializer` banaya. Isme 2 bahut important cheezein hain jo interview mein poochi jaati hain:

### A. `write_only=True` kya hota hai?
Code mein humne likha: 
`password = serializers.CharField(write_only=True)`

- **Read (Server se lana):** Jab user data mangta hai (GET).
- **Write (Server ko dena):** Jab user data bhejta hai (POST/PUT).

Agar hum `write_only=True` nahi lagayenge, toh registration hone ke baad jab API success response bhejegi, toh wo user ka password bhi response mein dikha degi! Ye bohot badi security risk hai. 
`write_only=True` ka matlab hai: *"Bhai, user se password le toh lo (write), par galti se bhi wapas dikhana mat (read nahi karna)!"*

### B. `create_user` method kyun use kiya?
Neeche humne `create()` function ko override karke `User.objects.create_user(...)` call kiya.
Agar hum normal `.save()` karte, toh Django password ko "123456" ki tarah plain text mein save kar deta. 
Par jab hum `create_user` use karte hain, toh Django automatically samajh jata hai ki ye password hai, aur usko encrypt (hash) karke database mein dalta hai. (E.g. `pbkdf2_sha256$260000$....`)

---

## ✅ Checklist for Day 5
- [x] Create `UserRegistrationSerializer` in `serializers.py`
- [x] Add password hashing logic in the Serializer
- [ ] Create `register_user` view in `views.py`
- [ ] Add URL route
- [ ] Test in Postman
