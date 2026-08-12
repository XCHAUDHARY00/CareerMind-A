# Day 21: Full Stack State Management & Token Refresh Interceptors 🔄

## 📌 Context & Concept Summary
Bhai, single-page application (SPA) me sabse bada bug hota hai: **"Random auto-logout during active user session"**. Short-lived access token expire hone par request 401 Unauthorized return karti hai. Humne Axios response interceptor ke dwaara **Silent Automatic Token Refreshing** implement kiya.

---

## 🛠️ Key Architecture Flow

```
[Frontend Axios Request] ──(Expired Token)──> [Backend API]
                                                  │
                                             Return 401
                                                  │
[Axios Interceptor Catches 401] <─────────────────┘
         │
         ├──> Send Refresh Token to `/api/token/refresh/`
         ├──> Store NEW Access Token in LocalStorage
         └──> Retry original failed request seamlessly! (User never logs out)
```

---

## 💻 Axios Interceptor Implementation (`api.js`)
```javascript
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await axios.post('/api/token/refresh/', { refresh });
        const newToken = res.data.access;
        localStorage.setItem('access_token', newToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

---

## ❓ 10 In-Depth Technical Interview Questions & Answers

### Q1: JWT Access Token Short-Lived (1 Day) aur Refresh Token Long-Lived (7 Days) Rakhne ki Dual-Token Security Architecture Why Mandatory?
**Detailed Answer (Bhai Language):** 
- **Access Token**: Every HTTP Authorization Header me pass hota hai (`Bearer ey...`). Internet transits & Client script memory me high exposure risks hone ki wajeh se, agar Attacker Access Token steal kar bhi le, to validity short-lived होने par window automatic closed ho jaati hai.
- **Refresh Token**: Client isey strict token refresh endpoint (`/api/token/refresh/`) ke alawa kisi public API header me send nahi karta. Is Dual Token architecture se System Security 10x improve hoti hai without forcing user logins daily.

---

### Q2: Axios Interceptor me `failedQueue` Promise Queue Promise holding Array Parallel Requests Race Condition kaise resolve karti hai?
**Detailed Answer (Bhai Language):** 
Jab user page reload karta hai, UI simultaneously 5 APIs trigger karti hai (Profile, DNA, Gaps, Roadmap, Streak). Agar Access Token Expired hai, to 5 requests Simultaneously HTTP `401 Unauthorized` throw karengi.
Without Promise Queue: 5 Parallel Token Refresh requests backend me duplicate hits karti.
With `failedQueue` Interceptor Pattern:
1. First 401 request `isRefreshing = true` flag set karti hai aur refresh API call karti hai.
2. Remaining 4 Parallel 401 requests `failedQueue` array me Hold (Pending Promises) ho jaati hain.
3. Refresh API successful response aate hi `processQueue(null, newToken)` execute hota hai, new token distribution ho jati hai, aur saari 5 pending requests single batch retry me pass ho jati hain!

---

### Q3: JWT Token Invalidation (Logout Execution) Server-Side State without Database Session Lookup kaise perform ki jaati hai?
**Detailed Answer (Bhai Language):** 
JWT Stateless Architecture follow karta hai. Server-Side Token Invalidation methods:
1. **Blacklist Refresh Token DB Table**: Logout request hit hone par `refresh_token` backend blacklist DB table me insert ho jata hai (`django-rest-framework-simplejwt.token_blacklist`). Refresh Attempt block ho jata hai.
2. **Client-Side Storage Flush**: `localStorage.clear()` removes both Access & Refresh tokens, dropping client capability to authorize.

---

### Q4: Infinite Loop Interceptor Retries (401 Infinite Trap) application crash kaise prevent kiya jata hai?
**Detailed Answer (Bhai Language):** 
`originalRequest._retry = true` flag guard clause check karke. Agar Retry request itself HTTP 401 return kare (meaning Refresh Token is ALSO Expired/Invalid), to flag check retry attempt block kar deta hai, storage clear karke client ko safely `/login` redirect kar deta hai.

---

### Q5: LocalStorage vs HttpOnly SameSite Cookies Storage Security comparison?
**Detailed Answer (Bhai Language):** 
- **LocalStorage**: JavaScript readable (`localStorage.getItem()`). If application suffers XSS vulnerability, attacker script can read tokens.
- **HttpOnly Cookies**: Browser enforces JavaScript access blocking (`document.cookie` cannot read). Completely immune to XSS token theft! Recommended for enterprise production setups.

---

### Q6: Axios Request Interceptor vs Response Interceptor Responsibilities separation?
**Detailed Answer (Bhai Language):** 
- **Request Interceptor**: Pre-flight HTTP dispatch step. Attaches `Authorization: Bearer <token>` header dynamically to outgoing requests.
- **Response Interceptor**: Post-flight HTTP arrival step. Analyzes status codes (`401`, `403`, `500`), triggers auto-refresh queues, and presents user toast error notifications.

---

### Q7: Single-Page Application (SPA) Client Router Protected Routes (`ProtectedRoute.jsx`) Auth state Guarding kaise karti hain?
**Detailed Answer (Bhai Language):** 
```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};
```
Isse non-authenticated users confidential app routes (`/dashboard`, `/profile`) direct URL typing se enter nahi kar sakte.

---

### Q8: SimpleJWT `ROTATE_REFRESH_TOKENS = True` Setting security footprint kaise elevate karti hai?
**Detailed Answer (Bhai Language):** 
Jab client Token Refresh Endpoint hit karta hai, server sirf new Access Token nahi bhejta, balki new Refresh Token bhi issue karta hai aur purana Refresh Token instant invalidate kar deta hai. Stolen Refresh Token replay attacks zero ho jaate hain.

---

### Q9: Silent Token Refreshing Failure (Network Offline) UX handling strategy kya hoti hai?
**Detailed Answer (Bhai Language):** 
Network Connection drop hone par Refresh API HTTP `Network Error` throw karti hai. Interceptor user ko force-logout nahi karta, balki temporary offline banner display karke Internet recover hone par request retry allow karta hai.

---

### Q10: Custom API Client Wrapper (`api.js`) vs Native `fetch()` Web API production advantages?
**Detailed Answer (Bhai Language):** 
Native `fetch()` headers injection, response status validation (`res.ok`), JSON body parsing (`await res.json()`), aur token refresh interceptors natively support nahi karta — massive duplicated boilerplate code require hota. Axios instances default headers, global timeout rules, base URLs, and response queues centralize kar dete hain.
