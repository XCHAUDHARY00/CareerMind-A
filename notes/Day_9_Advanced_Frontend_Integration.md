# Day 9: Advanced Frontend Integration & Django Signals

Aaj humne apni application ko ek "Amateur" level se "Production" level par laane ke liye kuch advanced techniques seekhin. JWT Tokens ko handle karna, UI ko premium banana aur Database mein auto-creation handle karna.

---

## 1. Django Signals (`post_save`)
Jab bhi database mein koi table me entry hoti hai, aur tum chahte ho ki uske turant baad koi action automatically ho jaye, toh hum **Signals** use karte hain.
Humne `post_save` signal banaya taaki jab bhi naya `User` (register) ho, uska khali `UserProfile` apne aap ban jaye.

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created: # Agar naya user create hua hai
        UserProfile.objects.create(user=instance)
```

## 2. Axios Request & Response Interceptors
**Interceptor** ka matlab hai "rasta rokna". 
- **Request Interceptor:** Har ek API call server tak pahunchne se pehle intercept hoti hai. Hum isme apna `access_token` ghusa dete hain taaki har jagah manually token na bhejna pade.
- **Response Interceptor:** Backend se jo response aata hai, wo component tak aane se pehle yahan aata hai. Humne iska use kiya `401 Unauthorized` (Token Expiry) pakadne ke liye, taaki hum user ko automatically logout kar sakein.

```javascript
// Response Interceptor for handling Token Expiry
api.interceptors.response.use(
    (response) => {
        return response; // Agar sab theek hai toh response aage jane do
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login'; // Auto-Logout
        }
        return Promise.reject(error);
    }
);
```

## 3. Advanced Serializers (Depth & SerializerMethodField)
Jab database mein foreign keys aur many-to-many relationship hote hain, toh by default DRF unki sirf ID bhejta hai (e.g. `skills: [1, 2]`).
Unki puri details mangwane ke liye humne 2 tarike use kiye:
1. `depth = 1`: Isse M2M relations aur ForeignKey relationships ka pura object JSON me aa jata hai.
2. `SerializerMethodField()`: Reverse relation (jaise `User` ke paas `Education` ka directly koi column nahi hai, lekin `Education` ke paas `User` ka column hai) ko nikalne ke liye custom method banaye.

---

## 🧠 Top Interview Questions (V.V. IMP)

**Q1. Django Signals kya hote hain aur `post_save` vs `pre_save` me kya farq hai?**
**Ans:** Signals ek mechanism hai jo sender aur receiver pattern follow karta hai. Jab database me koi action hota hai (jaise save) toh action se pehle (`pre_save`) ya baad me (`post_save`) hum custom code chala sakte hain. Ex: Naya User banne par uska welcome email bhej dena ya profile create kar dena `post_save` se hota hai.

**Q2. Agar tumhare frontend app me JWT token 5 minute me expire ho jata hai, toh user experience kaise theek rakhoge?**
**Ans:** Hum Axios me `Response Interceptor` lagayenge. Agar API response me `401 Unauthorized` aata hai, toh interceptor usko catch karke background me `/refresh` API call karke naya access token le aayega. Agar refresh token bhi expire ho gaya hai, toh hum user ka local storage clear karke usko `/login` page par redirect kar denge. Isko **Silent Refresh** flow bolte hain.

**Q3. React mein `useEffect` ke andar dependency array `[]` ka kya role hai API calling mein?**
**Ans:** Agar dependency array empty `[]` rakhi jaye, toh `useEffect` sirf component ke pehli baar mount hone (load hone) par chalega. Agar hum `[]` na lagayein, toh har bar state update hone par (jaise input type karne par) API call chali jayegi, jisse Infinite Loop aur DDOS attack jaisi condition ban sakti hai.

**Q4. Django Rest Framework me `SerializerMethodField` kab aur kyu use karte hain?**
**Ans:** Jab humein API response me koi aisi field bhejni ho jo directly database table me exist nahi karti (e.g. Total marks nikalne ka calculation, ya phir kisi Reverse Relation ka data mangwana) tab hum `SerializerMethodField` ka use karke ek custom function `get_<fieldname>` banate hain jo calculate karke value return karta hai.

**Q5. CORS Policy kya hoti hai aur ye frontend se API call karne par kyu fail hoti hai?**
**Ans:** CORS (Cross-Origin Resource Sharing) browser ki security policy hai. Agar frontend `localhost:5173` par chal raha hai aur backend `localhost:8000` par, toh origin alag hone ki wajah se browser API call rok deta hai. Isko theek karne ke liye humein backend me `django-cors-headers` package lagana padta hai aur `CORS_ALLOW_ALL_ORIGINS = True` set karna padta hai.

**Q6. JWT tokens me Access Token aur Refresh Token me kya difference hai?**
**Ans:** 
- **Access Token:** Ye short-lived hota hai (5-15 mins). Ye har API call ke header me jata hai authorization ke liye. Iski life choti isliye rakhte hain ki agar koi token chura le, toh wo zyada der tak system access na kar paye.
- **Refresh Token:** Ye long-lived hota hai (jaise 7 din ya 1 mahina). Ye sirf aur sirf naya Access Token mangwane ke liye use hota hai jab purana expire ho jata hai.

**Q7. Axios Interceptor ka kya fayda hai over normal Fetch/Axios request?**
**Ans:** Interceptor ek centralized middleware ki tarah kaam karta hai. Agar app me 100 API calls hain, toh har jagah manually try-catch aur `Authorization` header lagana padega. Interceptor ek jagah code likhne deta hai jo sabhi 100 requests par apne aap apply ho jata hai, jisse code DRY (Don't Repeat Yourself) aur clean rehta hai.
