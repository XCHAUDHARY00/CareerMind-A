# 📅 DAY 3 (Part 2): PUT, PATCH, & DELETE (Modifying Data)

## 1. What are PUT and PATCH? 🔄

**Concept:**
Jab humein naya data banana hota hai toh hum `POST` use karte hain. Lekin jab data **already bana hua hai aur usko change karna hai**, tab hum `PUT` ya `PATCH` use karte hain.

**PUT vs PATCH (The Difference):**
- **PUT:** Ye poore record ko replace kar deta hai. Agar ek field update karni hai toh bhi baaki saari fields bhejni padengi warna wo delete/blank ho jayengi.
- **PATCH:** Ye "Partial Update" karta hai. Jismein sirf wahi field bhejte hain jo change karni hai. (e.g., Sirf bio change karna hai toh sirf bio bhejo).

**Real-life example:**
Maan lo tumne pizza order kiya.
- Agar tum order cancel karke naya order dete ho (saari toppings wapas batate ho) = **PUT**
- Agar tum bolte ho "Bhai bas extra cheese daal do baki sab same rakho" = **PATCH**

---

## 2. DELETE Request 🗑️

**Concept:**
Naam se hi pata chal raha hai. Kisi record ko database se permanently uda dena.

**Status Code:**
Jab hum delete karte hain, toh hum aam taur par `204 No Content` status code return karte hain, jiska matlab hai "Kaam ho gaya, ab yahan dekhne ke liye kuch nahi bacha".

---

## 3. How to write them in Django? 📝

Jab hum PUT, PATCH, ya DELETE request bhejte hain, toh humein batana padta hai ki **kisko update/delete karna hai**. Isliye hum URL mein us data ki **ID (Primary Key/PK)** bhejte hain. E.g. `/updateprofile/1/`.

**Syntax Flow:**
1. Pehle ID se data dhoondho (`UserProfile.objects.get(pk=pk)`).
2. Agar data nahi mila toh `404 Not Found` bhej do.
3. Agar mil gaya toh:
   - **Update ke liye:** Serializer mein existing data aur naya data dono bhejo: `Serializer(existing_data, data=new_data, partial=True)`.
   - **Delete ke liye:** Direct object ko `.delete()` kar do.

---

## ✅ Checklist for Today
- [x] Understand difference between PUT and PATCH
- [x] Update `views.py` with `update_profile` view
- [x] Update `views.py` with `delete_profile` view
- [x] Add URLs for both with `<int:pk>`
- [x] Test in Postman

---

## 🎤 TOP 10 INTERVIEW QUESTIONS (PUT, PATCH & DELETE)

**Q1. PUT aur PATCH request me actual difference kya hai?**
**Ans:** PUT request ek resource ko completely replace karne ke liye use hoti hai (Idempotent hoti hai). Agar 5 fields me se sirf 1 update karni hai, tab bhi PUT me sabhi 5 fields bhejni padti hain. PATCH request partial update ke liye use hoti hai, isme sirf wahi field bheji jati hai jise change karna ho.

**Q2. POST aur PUT me kya farq hai?**
**Ans:** POST ek naya resource (record) create karne ke liye use hota hai. PUT ek existing resource ko update (replace) karne ke liye use hota hai. Agar PUT request kisi aisi ID par bheji jaye jo exist nahi karti, toh standard REST architecture ke mutabiq wo use create bhi kar sakti hai (upsert), halanki DRF me generally 404 return karte hain.

**Q3. `partial=True` ka DRF serializers me kya role hai?**
**Ans:** Jab hum PATCH request bhejte hain (partial update), tab humein serializer ko batana padta hai ki saari fields required nahi hain. `serializer = UserProfileSerializer(profile, data=request.data, partial=True)` likhne se DRF un fields ki validation error throw nahi karta jo data me missing hain.

**Q4. DELETE request ka ideal HTTP status code kya hona chahiye?**
**Ans:** `204 No Content`. Kyunki resource delete hone ke baad body me return karne ke liye kuch nahi bachta. Lekin agar aap response me confirmation message bhej rahe hain (jaise `{"msg": "Deleted"}`), tab `200 OK` bhi use kar sakte hain.

**Q5. HTTP Idempotency ka kya matlab hota hai? PUT idempotent hai ya nahi?**
**Ans:** Idempotency ka matlab hai ki agar main ek hi API request ko ek baar call karu ya 100 baar call karu, server ke database ka state same rahega. PUT aur DELETE **Idempotent** hain (100 baar same delete request maroge toh record ek hi baar delete hoga). Lekin POST idempotent nahi hai (100 baar POST karoge toh 100 naye records banenge).

**Q6. URL me `<int:pk>` ka kya use hai update/delete ke dauran?**
**Ans:** `<int:pk>` URL pattern matching hai jo URL se Primary Key (ID) nikal kar view function ko as an argument pass karta hai (e.g. `/api/updateprofile/5/` me pk=5 hoga). Isse view ko pata chalta hai ki kis specific record ko edit/delete karna hai.

**Q7. Agar hum galat ID par GET ya DELETE request karein, toh kya hoga?**
**Ans:** Database model `.get(pk=pk)` chalate waqt `DoesNotExist` exception raise karega. Humein use `try...except` block me catch karke `404 Not Found` response return karna padta hai, warna server crash ho jayega aur `500 Internal Server Error` aayega.

**Q8. Safe aur Unsafe HTTP methods kya hote hain?**
**Ans:** Safe methods wo hote hain jo database me koi badlav (change) nahi karte, sirf data read karte hain (e.g., `GET`, `OPTIONS`). Unsafe methods wo hote hain jo database ka data modify, create ya delete karte hain (e.g., `POST`, `PUT`, `PATCH`, `DELETE`).

**Q9. Kya PATCH requests idempotent hoti hain?**
**Ans:** Technically, PATCH hamesha idempotent nahi hoti. Agar PATCH request me hum field ko directly increment kar rahe hain (e.g., `age = age + 1`), toh multiple request bhejne par age bar-bar badhegi. Lekin absolute values assign karne par ye idempotent act karti hai.

**Q10. DRF me object ko delete karne ka function kaunsa hota hai?**
**Ans:** Object fetch karne ke baad hum seedhe Django ORM ka `.delete()` function call karte hain, jaise: `profile = UserProfile.objects.get(pk=pk); profile.delete()`. Ye record ko database se hata deta hai.
