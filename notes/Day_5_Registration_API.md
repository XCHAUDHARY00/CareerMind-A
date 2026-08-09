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

---

## 🎤 TOP 10 INTERVIEW QUESTIONS (User Registration & Passwords)

**Q1. Registration API me DRF ki default `.save()` method kyu use nahi karte?**
**Ans:** Agar hum default `.save()` use karte hain, toh password database me plain text (bina encrypt hue) save ho jayega. Django me user save karne ke liye `.create_user()` method use kiya jata hai kyunki ye automatically password ko secure hash algorithm se hash kar deta hai.

**Q2. `write_only=True` ka kya use hai Serializer me?**
**Ans:** Ye ensure karta hai ki field (jaise password) sirf input (POST request) lene ke kaam aaye. Jab API successfully registration ke baad response bhejti hai, toh password us response se gayab rehta hai. Ye security ke liye bohot zaroori hai.

**Q3. Password hashing kya hoti hai aur Django by default kaunsa hashing algorithm use karta hai?**
**Ans:** Password hashing ek one-way encryption technique hai. Password hash hone ke baad wapas original password me convert nahi kiya ja sakta. Django by default PBKDF2 hashing algorithm use karta hai SHA256 hash ke sath.

**Q4. Kya Registration API (View) par authentication zaroori hai?**
**Ans:** Nahi. Registration aur Login API publicly accessible honi chahiye (open). Agar hum uspe `@permission_classes([IsAuthenticated])` laga denge, toh naya user signup hi nahi kar payega kyunki uske paas token hi nahi hoga. Ise `@permission_classes([AllowAny])` rakhte hain.

**Q5. Agar main `User.objects.create(username='raj', password='123')` likhu toh admin panel se login kyu nahi hoga?**
**Ans:** Kyunki `create()` ne password ko hash nahi kiya. Admin panel verify karte time tumhare type kiye hue '123' ko hash karega aur database wale plain text '123' se match karega. Dono match nahi honge isliye login fail ho jayega.

**Q6. User Registration ke time agar same username already database me ho toh DRF kaise handle karta hai?**
**Ans:** Django ka built-in `User` model me `username` field pe `unique=True` constraint laga hota hai. Isliye DRF ka `ModelSerializer.is_valid()` internally check karta hai aur turant `{"username": ["A user with that username already exists."]}` ki error return kar deta hai, bina database crash kiye.

**Q7. Salting kya hoti hai password hashing me?**
**Ans:** Salting ek random string (salt) hoti hai jo password ke aage pichhe add ki jati hai hash banane se pehle. Iska fayda ye hai ki agar 2 users ka password same ('password123') bhi ho, toh unka final hash ekdum alag dikhega. Django ye internally handle karta hai.

**Q8. Hum DRF Serializers me custom validation kaise likhte hain (e.g. Password bohot weak na ho)?**
**Ans:** Hum serializer class ke andar `def validate_password(self, value):` naam ka function bana sakte hain. Is function me logic likh kar agar koi error hai toh `raise serializers.ValidationError("Password is too weak")` kar sakte hain.

**Q9. User creation ke turant baad automatically uska Profile kaise create kiya ja sakta hai?**
**Ans:** Django Signals (specifically `post_save`) ka use karke. Jab Django `User` model ka naya record save karta hai, wo `post_save` signal fire karta hai. Ek receiver function is signal ko pakad kar turant `UserProfile` create kar deta hai.

**Q10. Serializer method `create()` ko override kaise karte hain?**
**Ans:**
```python
def create(self, validated_data):
    user = User.objects.create_user(
        username=validated_data['username'],
        email=validated_data['email'],
        password=validated_data['password']
    )
    return user
```
