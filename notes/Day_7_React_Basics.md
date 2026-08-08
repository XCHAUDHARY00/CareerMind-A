# ⚛️ Day 7: React Basics, Frontend Setup, & API Integration

Aaj humne backend se nikal kar Frontend (React) ki duniya mein kadam rakha aur apna pehla Login/Register page connect kiya.

---

## 1. The Core 4 Pillars of React
* **JSX:** JavaScript XML. Code jisme HTML aur JavaScript dono ek sath likhe jaate hain. (Rule: Ek parent element zaroori hai).
* **Components:** UI ke chhote tukde (jaise Navbar, Login, Button). Inka naam hamesha **Capital Letter** se start hota hai.
* **State (`useState`):** Component ki "memory". Jab user input type karta hai, wo State me store hota hai. State change hone par React screen (UI) ko dobara render karta hai.
* **Props:** Jab ek Parent component se Child component tak data pass karna ho, toh us data ko Props bolte hain.

## 2. Vite & Tailwind CSS
* **Vite:** Ye React app bananane (scaffold karne) ka modern tareeka hai. Pehle hum `create-react-app` use karte the jo bohot slow tha. Vite extremely fast hai aur `.jsx` files ko browser ke samajhne layak code mein convert (bundle) karta hai.
* **Tailwind CSS:** Hum lambe CSS files nahi likhte. Classes (`flex-col`, `bg-blue-500`) HTML/JSX ke andar hi pass karke beautiful design bana lete hain.

## 3. React Router DOM
Single Page Applications (SPA) mein page refresh nahi hota. 
* **`BrowserRouter` / `<Routes>`:** Ye URL check karte hain aur bina refresh kiye sahi Component dikhate hain (`/login` pe `<Login/>`).
* **`useNavigate()`:** Code ke through user ko kisi naye page par phekna (Redirect karna). E.g., Registration success ke baad `navigate('/login')`.

## 4. API, Axios, & Environment Variables (.env)
* **Axios:** Humara postman. Ye React se Data utha kar Django (Backend) par le jata hai.
* **CORS (Cross-Origin Resource Sharing):** Security feature jo 2 alag ports (5173 aur 8000) ko aapas mein baat karne se rokta hai jab tak backend explicitly permission (CORS headers) na de.
* **`.env` files:** Base URL (`http://127.0.0.1:8000/api`) ko har jagah har page pe likhna bewakoofi hai. Hum ise `.env` me (jaise `VITE_API_BASE_URL`) save karte hain aur `api.js` (axios instance) me configure karte hain taaki kal URL change ho toh bas ek file me karna pade.

---

## 🎤 Top Interview Questions (Aaj ke topics se)

**Q1: What is the difference between State and Props?**
* **State:** Component ke andar ka local data hai. Ise component khud change kar sakta hai (using setState).
* **Props:** Parent component se aaya hua external data hai. Props *read-only* (immutable) hote hain.

**Q2: Why do we use `e.preventDefault()` in form submission?**
* Normal HTML form submit hone par poore web page ko reload kar deta hai. React ek Single Page App (SPA) hai. `e.preventDefault()` us default reloading behavior ko rokta hai, taaki hum background me Axios API call kar sakein.

**Q3: What is CORS and why does it occur?**
* CORS ek browser security mechanism hai. Jab Frontend (`localhost:5173`) kisi doosre server (`localhost:8000`) par API call karta hai, toh browser is cross-origin request ko rok deta hai agar backend me CORS allowed nahi hai. Django me hume `django-cors-headers` package lagana padta hai isko theek karne ke liye.

**Q4: Why store API Base URL in `.env` file instead of hardcoding?**
* Development aur Production environments alag hote hain. Hardcoded URL ko har jagah change karna padega jab app live hogi (e.g., `api.careermind.com`). `.env` file environment ke hisab se automatic URL provide kar deti hai aur code clean rehta hai.

**Q5: Vite vs Create-React-App (CRA)?**
* CRA development build me bohot time leta hai kyunki wo Webpack use karta hai. Vite *ES Modules* use karta hai jis se Hot Module Replacement (HMR) fast hota hai aur server microseconds mein start ho jata hai.
