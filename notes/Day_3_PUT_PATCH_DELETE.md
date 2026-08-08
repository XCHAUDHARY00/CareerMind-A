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
