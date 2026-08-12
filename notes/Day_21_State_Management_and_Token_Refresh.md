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

## ❓ 10 Technical Interview Questions & Answers

### Q1: Access Token short-lived (e.g. 1 day) aur Refresh Token long-lived (7 days) kyu hote hain?
**Answer:** Access Token client-side security risk me expose hota hai (har HTTP header me jata hai). Agar intercept ho jaaye to attacker access max 1 day tak raheta hai. Refresh Token secure endpoint par hit karta hai to mint fresh access tokens.

### Q2: Interceptor me `failedQueue` (Promise Queue) ka kya role hai?
**Answer:** Jab multiple parallel API requests simultaneously 401 hit karti hain, tab sirf 1 refresh call jati hai. Baaki pending requests queue me hold ho jati hain aur new token milte hi replay ho jati hain (avoiding race conditions).

### Q3: React Query (TanStack Query) client-side state caching me kaise help karta hai?
**Answer:** Component unmount hone par data memory me cache rakhta hai, window refocus par auto-refetch karta hai, aur global loading/error states out-of-the-box provide karta hai.

### Q4: Infinite loop token refresh interceptor me kaise roka jata hai?
**Answer:** `originalRequest._retry = true` flag check karke. Agar refresh call itself fail hoti hai ya original request dobara fail hoti hai to user clear storage ke saath `/login` redirect hota hai.

### Q5: LocalStorage vs HttpOnly Cookies JWT storage for security?
**Answer:** `HttpOnly Cookies` XSS attacks se completely protected hote hain kyunki JavaScript unko read nahi kar sakti. `LocalStorage` easier to setup hai par XSS Vulnerable hota hai, isiliye input sanitization compulsory hoti hai.

### Q6: Axios Response Interceptor Request Interceptor se kaise alag hai?
**Answer:** Request Interceptor request bhejne se *pehle* run hota hai (header Authorization token add karne ke liye). Response Interceptor server output return hone ke *baad* run hota hai (errors status handle karne ke liye).

### Q7: User Token Expire hone par bina page reload state reset kaise hoti hai?
**Answer:** AuthContext me `logout()` call karke `user` state `null` set kar di jaati hai jisse React router ProtectedRoute component auto-redirect trigger karta hai.

### Q8: SimpleJWT library Django me refresh token rotation kya hota hai?
**Answer:** `ROTATE_REFRESH_TOKENS = True` config set karne se har refresh endpoint hit par new Refresh Token issue hota hai aur purana blacklist me chala jata hai (High Security).

### Q9: 403 Forbidden vs 401 Unauthorized status codes me kya fark hai?
**Answer:** `401 Unauthorized`: Client authenticated nahi hai (token missing/expired). `403 Forbidden`: Client authenticated hai par specific resource access karne ke permission nahi hain.

### Q10: Parallel requests token refresh race condition test kaise kar sakte hain?
**Answer:** Browser DevTools Network Tab me Throttling Set karke Simultaneously 5 different API endpoints (Profile, DNA, Gaps, Roadmap, Chat) triggering manually run karna.
