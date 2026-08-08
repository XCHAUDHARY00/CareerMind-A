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

## 🎤 TOP 25 INTERVIEW QUESTIONS (React & API Integration)

Yahan har ek concept par sabse zyada pooche jaane wale 25 questions hain. Ye poora padh liya toh base clear!

### 🟢 React Core & JSX
**Q1: React kya hai aur ye kyun use hota hai?**
* React ek JavaScript library hai (framework nahi) jise Facebook ne banaya hai. Ye re-usable components bana kar fast aur interactive User Interfaces (UI) banane ke liye use hoti hai.

**Q2: JSX kya hota hai?**
* JSX (JavaScript XML) ek syntax extension hai jo humein JavaScript ke andar HTML likhne ki suvidha deta hai. Ye code ko padhne aur likhne me aasan banata hai.

**Q3: JSX mein class ki jagah className kyun likhte hain?**
* Kyunki `class` JavaScript mein ek reserved keyword hai (OOPs ke liye). Isliye JSX mein HTML class dene ke liye `className` ka use hota hai.

**Q4: Virtual DOM kya hota hai?**
* React ek Virtual DOM (memory me Real DOM ki copy) maintain karta hai. Jab state change hoti hai, toh React Virtual DOM me changes karta hai, use Real DOM se compare karta hai (diffing algorithm), aur sirf wahi hissa update karta hai jo badla hai. Is-se app fast hoti hai.

**Q5: Component ka naam Capital letter se kyun start hota hai?**
* Taaki React normal HTML tags (`<div>`, `<p>`) aur tumhare custom React components (`<Navbar>`, `<Login>`) ke beech difference samajh sake.

### 🟡 State & Props
**Q6: State aur Props mein kya difference hai?**
* **State:** Component ki internal memory hoti hai jise wo khud update kar sakta hai (`setState` se).
* **Props:** External data hota hai jo Parent se Child component ko milta hai. Ye read-only (immutable) hota hai, child isko change nahi kar sakta.

**Q7: `useState` hook kya karta hai?**
* Ye ek functional component ke andar state (variables) add karne aur unhe update karne ka tareeka deta hai. Isko update karne par React page ko automatically re-render karta hai.

**Q8: Hooks hamesha component ke top par kyun define kiye jaate hain?**
* Taaki React har render cycle me hooks ko same order me execute kar sake. Hooks ko loops, conditions (if-else), ya nested functions ke andar likhna allowed nahi hai.

**Q9: React mein data flow kaisa hota hai?**
* React mein data hamesha ek hi direction me flow hota hai (Unidirectional Data Flow), yani Parent component se Child component ki taraf (via props).

**Q10: "Prop Drilling" kya hota hai?**
* Jab data ko kisi deeply nested child component tak pohanchana ho, toh use beech ke unn components se pass karna padta hai jinhe us data ki zaroorat hi nahi hoti. Ise Prop Drilling kehte hain.

### 🔵 React Router DOM
**Q11: Single Page Application (SPA) kya hoti hai?**
* SPA wo application hai jisme server se sirf ek HTML page load hota hai. Uske baad, user clicks par page reload nahi hota, sirf React components JS ke through change hote hain.

**Q12: `react-router-dom` mein `<Link>` aur normal `<a href>` mein kya fark hai?**
* `<a href>` browser ko naya page load karne ke liye kehta hai (page refresh hota hai). `<Link>` page refresh kiye bina components ko change karta hai (SPA feel).

**Q13: `useNavigate` hook ka kya use hai?**
* Ye code/logic ke through user ko ek page se doosre page par redirect karne ke kaam aata hai (jaise login successful hone par Dashboard pe bhej dena).

**Q14: Dynamic Routing kya hoti hai?**
* Jab hum URL mein variable data pass karte hain. Jaise `/user/:id` mein `id` dynamic hai, jo `/user/1` ya `/user/2` ho sakti hai. Isko `useParams` hook se read karte hain.

**Q15: "Not Found" (404) page kaise banate hain React Router me?**
* `<Route path="*" element={<NotFound />} />` banakar. `*` path un sabhi URLs ko match karta hai jo define nahi kiye gaye hain.

### 🟠 API, Axios & CORS
**Q16: Axios aur Fetch API mein kya difference hai?**
* Fetch browser ki in-built API hai, par usme data ko JSON me manual convert karna padta hai. Axios ek 3rd party library hai jo JSON conversion khud karti hai, errors easily handle karti hai, aur request interceptors provide karti hai.

**Q17: Form submit karne par `e.preventDefault()` kyun use karte hain?**
* Default form submission browser ka page reload kar deta hai. `e.preventDefault()` us reload ko rok kar humein AJAX (Axios) request bhejne deta hai.

**Q18: CORS kya hota hai aur kyun aata hai error?**
* CORS (Cross-Origin Resource Sharing) browser ka security feature hai. Agar tera frontend (port 5173) kisi doosre domain/port (8000) se data mangta hai, toh browser is cross-origin request ko block kar deta hai, jab tak backend `Access-Control-Allow-Origin` header na bhej de.

**Q19: `.env` file ka purpose kya hai?**
* Sensitive keys, passwords, aur environment specific URLs (jaise API BASE URL) store karne ke liye taaki wo Github par publicly expose na hon, aur Development/Production ke URLs asani se switch ho sakein.

**Q20: React mein form ke data ko (Input fields) kaise manage karte hain?**
* Hum "Controlled Components" use karte hain. Har input ka `value` State se juda hota hai, aur usme `onChange` event listener lagate hain jo type karne par us State ko update karta hai.

### 🟣 JWT & Security Basics
**Q21: JWT (JSON Web Token) kya hai?**
* Ye ek secure string (token) hai jo 3 parts (Header, Payload, Signature) me hota hai. Jab user login karta hai, backend use JWT deta hai jise frontend local storage me rakhta hai aur har aage ki request ke sath bhejta hai verify karne ke liye ki user logged in hai.

**Q22: Access Token aur Refresh Token mein kya fark hai?**
* **Access Token:** Short-lived hota hai (e.g. 5-15 mins). Har API call me server ko bheja jata hai identity proof ke liye.
* **Refresh Token:** Long-lived hota hai (e.g. 1-7 days). Jab Access Token expire ho jata hai, toh naya Access Token laane ke liye Refresh Token use hota hai.

**Q23: LocalStorage aur SessionStorage mein kya difference hai?**
* **LocalStorage:** Data hamesha save rehta hai, browser close karne ke baad bhi. (Tab tak delete nahi hota jab tak user ya code use delete na kare).
* **SessionStorage:** Data sirf us tab ke open rehne tak save rehta hai. Tab close karte hi delete ho jata hai.

**Q24: Axios Interceptors kya hote hain?**
* Interceptors wo middleware function hain jo kisi bhi API request ke bheje jaane se *pehle*, ya response aane ke *baad*, usme changes kar sakte hain. Jaise har request ke header mein automatically JWT token daalna. (Ye hum aage use karenge!)

**Q25: Promise aur `async/await` mein kya farq hai?**
* Dono Asynchronous JS ko handle karte hain (jaise API calls jisme time lagta hai). Promises me `.then().catch()` likhna padta hai jo complex ho jata hai. `async/await` wahi kaam karta hai par code synchronous (line-by-line) jaisa lagta hai aur clean hota hai.
