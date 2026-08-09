# 🔐 Day 8: Frontend Authentication, JWT Handling & Protected Routes

Aaj hum frontend (React) mein security aur authentication add karenge. Backend toh humne JWT (JSON Web Tokens) se secure kar liya tha, ab frontend ko sikhayenge ki login ke baad us token ka use kaise karna hai aur bina login ke users ko Dashboard se kaise rokna hai!

---

## 1. Handling JWT on Frontend (Local Storage)
Jab user successfully login karta hai, backend humein do tokens deta hai: `access` aur `refresh`.
Inko humein browser mein save karna hota hai taaki jab user page refresh kare, toh wo logout na ho jaye.

* **LocalStorage:** Hum in tokens ko `localStorage` mein save karte hain kyunki ye browser close karne ke baad bhi persist karte hain.
* **Saving Token:** `localStorage.setItem('access_token', response.data.access)`
* **Getting Token:** `localStorage.getItem('access_token')`
* **Removing Token (Logout):** `localStorage.removeItem('access_token')`

## 2. Axios Interceptors (The Middleware)
Har API request (jaise profile lana, dashboard dekhna) mein humein `Authorization` header mein token bhejna padta hai.
Bar-bar har jagah token fetch karke lagana achha idea nahi hai. Yahan **Axios Interceptors** kaam aate hain.

* **Request Interceptor:** Ye ek function hai jo har API request ke bheje jaane se *pehle* chalega. Hum isme apna access token attach kar dete hain. Agar token expire ho gaya hai, toh hum interceptor ke andar hi error handle karke refresh token se naya access token laa sakte hain.

## 3. Protected Routes in React (Guarding the Pages)
Hum nahi chahte ki koi user seedhe `/dashboard` type karke bina login kiye andar aa jaye.
Iske liye hum ek **Protected Route (Private Route)** component banate hain.

* Ye component check karta hai ki kya user ke paas valid token hai?
* **Agar HAI:** Toh usko andar jaane do (Render `children`).
* **Agar NAHI:** Toh usko wapas `/login` page par bhej do (`Navigate` use karke).

## 4. Loading & Error States
API calls asynchronous hoti hain (unko poora hone mein time lagta hai). Jab tak data aa raha hai, humein user ko ek spinner ya "Loading..." dikhana chahiye warna usko lagega app hang ho gayi.
* **Loading State:** `const [isLoading, setIsLoading] = useState(false);`
* **Error State:** `const [error, setError] = useState('');` (Agar API fail ho jaye toh user ko error message dikhana).

---

## 🎤 TOP INTERVIEW QUESTIONS (Frontend Auth & JWT)

**Q1: Token ko LocalStorage mein kyun save karte hain, state (useState) mein kyun nahi?**
* Agar token ko sirf State mein rakhenge, toh page refresh karte hi State clear ho jayegi aur user automatically logout ho jayega. LocalStorage data tab tak save rakhta hai jab tak usko manually delete na kiya jaye.

**Q2: Axios Interceptor kya hota hai? Aur hum iska use kyun karte hain?**
* Interceptor ek tarah ka middleware hai jo Request ya Response ko server tak pahunchne ya frontend par aane se pehle intercept karta hai. Hum iska use har request ke header mein automatically Authorization token add karne ke liye karte hain, taaki code duplicate na karna pade.

**Q3: Protected Route (Private Route) kaise kaam karta hai React mein?**
* Ye ek wrapper component hota hai jo conditionally routes ko render karta hai. Ye pehle check karta hai ki user authenticated hai ya nahi (jaise token check karke). Agar user authenticated hai, toh ye actual component dikhata hai, warna user ko login page par redirect kar deta hai.

**Q4: Agar Access Token expire ho jaye, toh kya process hota hai?**
* Jab Access token expire hota hai, API (401 Unauthorized) error deti hai. Is error ko Axios Response Interceptor catch karta hai, Refresh token bhej kar naya Access token laata hai, local storage me update karta hai, aur purani fail hui request ko nayi token ke sath dobara bhejta hai. Ye sab user ko pata chale bina (seamlessly) ho jata hai.

**Q5: JWT secure kaise hai agar koi bhi use LocalStorage se dekh sakta hai?**
* JWT ka payload koi bhi dekh sakta hai (usko base64 decode karke), par koi usko alter (change) nahi kar sakta bina 'Secret Key' ke jo sirf server ke paas hoti hai. Agar kisi ne token change kiya, toh uska Signature mismatch ho jayega aur server usko reject kar dega. Security ke liye token ki expiry bohot kam rakhi jati hai (e.g., 5-15 mins).
