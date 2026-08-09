# 📅 DAY 4: User Authentication & JWT (Deep Dive) 🔐

Bhai, API banana humne seekh liya, lekin abhi koi bhi aakar hamari API hit kar sakta hai aur data modify kar sakta hai. Ye toh bahut danger baat hai. Isliye humein **Authentication** ki zaroorat padti hai.

---

## 1. The Core Problem: HTTP is Stateless 🤷‍♂️

**Concept:** 
Tumhara browser/Postman jab backend se baat karta hai toh wo **HTTP Protocol** ka use karta hai. 
HTTP ki ek sabse badi problem (aur feature) ye hai ki wo **Stateless** hai.
Iska matlab HTTP ke paas memory nahi hoti, usko "Ghajini" wali bimari hai. 

Agar tumne pehli request bheji: "Main Raj hoon, ye mera password hai (Login)." Backend bolega: "Welcome Raj!".
Lekin agle hi second jab tum doosri request bhejoge: "Mera profile update kar do." Toh Backend puchega: "Tu kaun hai bhai?"

Kyunki HTTP pichhli request bhool jata hai, humein koi aisa tarika chahiye jisse har request ke sath ek "Pehchaan Patra" (ID Card) bheja ja sake.

---

## 2. Authentication vs Authorization 👮‍♂️

Ye dono shabd sunne mein same lagte hain but alag hain:
- **Authentication:** Tum kaun ho? (Identity check - Login)
- **Authorization:** Kya tum is kaam ke laayak ho? (Permission check - Kya ek normal user doosre ka profile delete kar sakta hai? Nahi.)

---

## 3. JWT (JSON Web Token) kya hai? 🎟️

JWT hamare system ka **VIP Wristband** hai.

**Real-life Example:**
Maan lo tum ek premium club jate ho. 
1. Tum guard ko ID dikhate ho (Username/Password) - Ye **Login** hai.
2. Guard ID check karta hai aur tumhe ek Wristband pehna deta hai. Ye Wristband **JWT Token** hai.
3. Ab club mein andar drinks lene, VIP area mein jane ke liye tumhe baar-baar ID nahi dikhani. Tum bas wristband dikhate ho aur kaam ho jata hai. Ye **Protected API Request** hai.

**Technical Flow:**
1. Frontend `POST /api/login/` karta hai email/password ke sath.
2. Django verify karta hai aur ek lamba sa text (Token) wapas bhejta hai.
3. Frontend us token ko apne paas save kar leta hai (LocalStorage/Cookies mein).
4. Ab jab bhi frontend koi protected API hit karta hai, toh wo token ko `Header` mein lagakar bhejta hai: `Authorization: Bearer <token>`.
5. Django us token ko dekhta hai, decode karta hai, aur samajh jata hai ki ye request kis user ki hai.

---

## 4. JWT ke andar kya hota hai? 🔍

JWT ek encrypted string lagta hai, par actually uske 3 hisse hote hain (separated by dots `.`):

1. **Header:** Batata hai ki algorithm kaunsa use hua hai token banane ke liye (e.g., HS256).
2. **Payload:** Asli data! Isme normally User ki ID aur expiry time hoti hai. E.g., `{"user_id": 1, "exp": 1690000000}`.
3. **Signature:** Ye sabse important hai. Ye ek special "Secret Key" (jo sirf Django ki `settings.py` mein hoti hai) se banta hai. Agar koi hacker Payload mein apni ID change karke `user_id: 2` karne ki koshish karega, toh Signature match nahi hoga aur Django usko bhaga dega (401 Unauthorized).

---

## 5. Access Token vs Refresh Token 🔄

JWT 2 types ke bante hain security ke liye:
- **Access Token:** Ye 5-15 minute ke liye valid hota hai. Tum isi ko bhejkar saara data late ho. Agar ye chori ho gaya toh 15 minute baad automatically kachra ho jayega.
- **Refresh Token:** Ye lamba chalta hai (jaise 7 din ya 30 din). Jab Access Token expire ho jata hai, toh frontend chup-chaap Refresh Token bhej kar naya Access Token le leta hai, taaki user ko baar-baar password daal kar login na karna pade.

## 6. The Magic of TokenObtainPairView 🎩

Ek bahut valid question aata hai: **"Humne username aur password check karne ka view ya code toh likha hi nahi, toh JWT ko kaise pata chalega ki password sahi hai?"**

**Answer:**
Django ke andar apna ek built-in `User` model aur Authentication system pehle se hota hai (Jiske wajah se hum Admin panel mein login kar paate hain). 
`simplejwt` library Django ke is built-in system se permanently connected hoti hai. 

Jab tum `TokenObtainPairView` par POST request bhejte ho (username aur password ke sath), toh ye library "under the hood" (parde ke peeche) ye kaam karti hai:
1. Tumhare diye gaye username ko database mein dhoondhti hai.
2. Tumhare diye gaye password ko hash karke database wale hashed password se match karti hai.
3. Agar match ho gaya -> Toh **Access + Refresh Token** banakar de deti hai.
4. Agar galat password dala -> Toh turant `401 Unauthorized` de deti hai.

Isliye humein Login/Validation ka code scratch se likhne ki zaroorat nahi padti! Lekin haan, **Registration (Naya account banana)** ka code humein khud likhna padega aage chalkar.

---

## ✅ Checklist for Day 4
- [x] Understand HTTP Statelessness
- [x] Understand JWT structure
- [x] Install `djangorestframework-simplejwt`
- [x] Configure JWT in `settings.py`
- [x] Understand the magic of TokenObtainPairView
- [x] Test Token generation API in Postman

---

## 🎤 TOP 10 INTERVIEW QUESTIONS (JWT & Authentication)

**Q1. Authentication aur Authorization me exact difference kya hai?**
**Ans:** Authentication ka matlab hai user ki identity verify karna (E.g. Username/Password check karna ki tum wahi ho jo bol rahe ho). Authorization ka matlab hai permissions check karna (E.g. Kya is user ko ye specific API ya data access karne ka haq hai?).

**Q2. Session-based authentication aur Token-based authentication (JWT) me kya farq hai?**
**Ans:** Session-based authentication me backend (server) user ka session data memory ya database me store karta hai aur frontend ko ek Session ID deta hai (cookies me). Backend ko bar-bar DB hit karna padta hai. JWT stateless hota hai; isme server koi session store nahi karta, saari information token me encrypted form me hoti hai, jisse server ka load kam hota hai aur scaling aasan hoti hai.

**Q3. JWT ke 3 main parts kaunse hote hain?**
**Ans:** 
1. **Header:** Algorithm aur token type ki jankari (E.g. HS256).
2. **Payload:** Asli data jise claims bolte hain (E.g. User ID, Token Expiry).
3. **Signature:** Ye Header aur Payload ko secret key se hash karke banta hai, taaki token temper (change) na ho sake.

**Q4. Access Token aur Refresh Token do alag-alag token kyu use kiye jate hain?**
**Ans:** Security ke liye. Access Token ki life short (e.g., 5 mins) rakhte hain taaki agar token chori bhi ho jaye toh hacker use zyada der access na kar paye. Refresh Token ki life lambi hoti hai aur ye sirf naya Access Token fetch karne ke kaam aata hai. Isse baar-baar login karne ka hassle bhi bachta hai aur security bhi maintain rehti hai.

**Q5. Agar ek baar JWT token issue ho gaya aur user immediately password change kar le, toh purana token valid rahega ya nahi?**
**Ans:** By default JWT stateless hai, isliye agar expiration time bacha hai toh purana token **valid rahega**. Isko mitigate karne ke liye backend me hum ek "Token Blacklist" ya database flag use karte hain jisse password change hone par saare purane tokens invalid (blacklist) kar diye jate hain.

**Q6. TokenObtainPairView Django/SimpleJWT me kya karta hai?**
**Ans:** Ye ek in-built API view hai jisko username/email aur password bhejne par ye user ko authenticate karta hai aur response me valid Access Token aur Refresh Token ka pair bana kar return karta hai. Hum isme custom claims (e.g. user ki email ya role) bhi add kar sakte hain.

**Q7. IsAuthenticated permission class DRF me kya role play karti hai?**
**Ans:** `@permission_classes([IsAuthenticated])` lagane se DRF us API endpoint par tab tak access allow nahi karta jab tak request ke header me ek valid (un-expired) authentication token (e.g. JWT) na ho. Agar token missing ya galat hai, toh ye automatically `401 Unauthorized` throw kar deta hai.

**Q8. JWT token ko modify karne se kya hoga?**
**Ans:** Agar koi (hacker/user) base64 decoded payload me data change (e.g. `user_id = 1` se `user_id = 2`) karne ki koshish karta hai, toh uski Signature invalid ho jayegi kyunki original Signature server ki private secret key se bani thi. Server token ko dekhte hi turant reject (401 Unauthorized) kar dega.

**Q9. Kya JWT ke payload me sensitive data (jaise Password ya Credit Card) rakhna chahiye?**
**Ans:** Bilkul NAHI! JWT ka payload bas base64 se encoded hota hai (encrypted nahi hota). Iska matlab koi bhi us token ko decode karke payload padh sakta hai. Isliye isme sirf Public / Non-sensitive information (Jaise user id, role) hi rakhni chahiye.

**Q10. Frontend me JWT token ko kahan store karna sabse secure maana jata hai?**
**Ans:** Commonly LocalStorage ya SessionStorage me store karte hain. Lekin XSS (Cross-Site Scripting) attacks se bachne ke liye sabse secure tareeka ise **HttpOnly Cookies** me store karna maana jata hai, kyunki JavaScript un cookies ko read/access nahi kar sakti.
