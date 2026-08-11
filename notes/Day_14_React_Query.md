# Day 14 — React Query: Complete Guide

## Kyun chahiye tha React Query?

Pehle hum manually kar rahe the:
```js
// ❌ Junior approach — sab manually karo
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

Problems:
- Har component mein repeat karo
- Cache manually manage karo (localStorage)
- Background refresh khud likhna
- Race conditions handle karna (2 requests ek saath)
- Retry logic khud banana

**React Query ek baar mein sab solve karta hai.**

---

## Architecture — React Query kaise kaam karta hai

```
                        App.jsx
                    ┌─────────────────────┐
                    │  QueryClientProvider │  ← Global cache store
                    │  (ek baar banao)     │
                    └──────────┬──────────┘
                               │ queryClient (shared)
               ┌───────────────┼────────────────┐
               │               │                │
         CareerDNA          SkillGaps        Dashboard
         useQuery(          useQuery(         useQuery(
           ['career-dna']    ['skill-gaps',    ['dashboard']
         )                    role]           )
               │               │                │
               └───────────────┴────────────────┘
                               │
                        QueryClient Cache
                    ┌─────────────────────┐
                    │  'career-dna'  ✅   │  ← Fresh (< 10 min)
                    │  'skill-gaps', null │  ← Stale (> 10 min)
                    │  'skill-gaps',      │
                    │   'AI Engineer' 🆕  │  ← New (fetching)
                    └─────────────────────┘
```

---

## Setup — Sirf 3 cheezein

### 1. Install
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 2. App.jsx — QueryClientProvider wrap karo
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,  // 10 min fresh
      gcTime:    30 * 60 * 1000,  // 30 min memory
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ...routes */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 3. Component mein useQuery
```jsx
import { useQuery } from '@tanstack/react-query';

const MyComponent = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['my-data'],
    queryFn: () => api.get('/my-endpoint/').then(r => r.data),
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <Error message={error.message} />;
  return <div>{data.name}</div>;
};
```

---

## Key Concepts — Ek Ek Samjho

### 1. queryKey — Cache ka naam hai

```js
useQuery({ queryKey: ['career-dna'] })
// Cache mein save hoga: 'career-dna'

useQuery({ queryKey: ['skill-gaps', 'AI Engineer'] })
// Cache mein save hoga: 'skill-gaps-AI Engineer'
// Alag key = alag cache entry

useQuery({ queryKey: ['skill-gaps', null] })
// Alag entry — default role ke liye
```

**Rule:** queryKey mein woh sab cheezein dalo jo result change karti hain.

```
queryKey: ['skill-gaps', selectedRole]
                           ↑
              Ye change hoga → React Query automatically
              naya API call karega new role ke liye
```

### 2. staleTime vs gcTime

```
                     API call
                       ↓
                   Data aaya ✅
                       │
    ┌──────────────────┴──────────────────┐
    │           staleTime: 10 min         │
    │    (Data "fresh" maana jaayega)     │
    │    Is dauraan: NO API call          │
    └──────────────────┬──────────────────┘
                       │ 10 min baad...
                       │ Data "stale" ho gaya
                       │ Next open pe: purana data dikha
                       │ + background mein new fetch karo
    ┌──────────────────┴──────────────────┐
    │            gcTime: 30 min           │
    │    (Garbage Collection time)        │
    │    Page close hone ke 30 min baad   │
    │    memory se delete hoga            │
    └─────────────────────────────────────┘
```

### 3. isFetching vs isLoading

```
isLoading  → true sirf PEHLI baar (no cache)
             Loading skeleton dikhao

isFetching → true jab bhi API call ho raha ho
             (pehli baar bhi, background refresh bhi)
             Subtle spinner dikhao
```

### 4. placeholderData — Role switch pe smooth UX

```js
useQuery({
  queryKey: ['skill-gaps', selectedRole],
  queryFn: () => fetchSkillGaps(selectedRole),

  // Jab role switch ho → purana data toot ta nahi
  // Naya data aane tak purana dikhata rehta hai
  placeholderData: (previousData) => previousData,
})
```

```
User ne "AI Engineer" click kiya
    ↓
queryKey change hua: ['skill-gaps', 'AI Engineer']
    ↓
React Query ne purana data ['skill-gaps', null] dikhaya
    ↓ (background mein AI Engineer data fetch hua)
Naya data aaya → smoothly replace hua
```

---

## Cache Invalidation — Data Update hone par

```js
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Skills add karne ke baad:
await api.post('/addskills/', data);
queryClient.invalidateQueries({ queryKey: ['skill-gaps'] });
// ↑ Sabhi skill-gap queries invalidate ho jaayengi
// Next access pe fresh data aayega

// Specific role invalidate:
queryClient.invalidateQueries({ queryKey: ['skill-gaps', 'AI Engineer'] });

// Sabhi queries invalidate (profile update ke baad):
queryClient.invalidateQueries();
```

---

## Pattern — Har Naye API ke liye Template

```jsx
// 1. Fetch function (component ke bahar)
const fetchMyData = async () => {
  const res = await api.get('/my-endpoint/');
  if (res.data?.status !== 'success') {
    throw new Error(res.data?.message || 'Failed');
  }
  return res.data.data;
};

// 2. Component ke andar
const MyPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-data'],
    queryFn: fetchMyData,
  });

  if (isLoading) return <Skeleton />;

  return (
    <>
      {isError && <ErrorBanner msg={error.message} onRetry={refetch} />}
      <div>{data?.someField}</div>
    </>
  );
};
```

---

## Aane wale APIs mein kaise lagayenge

| Page | queryKey | queryFn |
|------|----------|---------|
| Dashboard | `['dashboard']` | `GET /myprofile/` |
| Roadmap | `['roadmap']` | `POST /roadmap/` |
| Jobs | `['jobs', filters]` | `GET /jobs/` |
| GitHub | `['github']` | `GET /github-analysis/` |
| Profile | `['profile']` | `GET /myprofile/` |
| Chat History | `['chat-history']` | `GET /chat/history/` |

---

## DevTools — Development ka best friend

Jab app chal raha ho, bottom-right corner mein ek TanStack icon dikhai dega.

Click karne par:
```
┌─────────────────────────────────────┐
│  Queries                            │
│  ┌─────────────────────────────┐   │
│  │ career-dna        FRESH ✅  │   │
│  │ skill-gaps, null  STALE 🟡  │   │
│  │ skill-gaps, AI Eng FETCHING │   │
│  └─────────────────────────────┘   │
│  [Refetch] [Invalidate] [Remove]    │
└─────────────────────────────────────┘
```

---

## Interview Questions — React Query (15 Questions)

**Q1. React Query kya hai aur kyun use karte hain?**
> React Query ek server state management library hai jo async data fetch karne, cache karne, background mein sync karne aur stale data handle karne ka kaam karta hai. Iska faayda ye hai ki humein manually useState, useEffect, loading/error states manage nahi karni padtein — `useQuery` ek hi hook mein sab handle karta hai. Ye race conditions, duplicate requests aur cache invalidation bhi handle karta hai.

**Q2. queryKey ka kya role hai?**
> queryKey ek unique identifier hai jo cache entry ko identify karta hai. Array format mein hota hai — `['skill-gaps', role]`. Jab queryKey ka koi bhi element change hota hai, React Query automatically naya API call karta hai aur result alag cache entry mein save karta hai.

**Q3. staleTime aur gcTime mein kya fark hai?**
> `staleTime`: Kitne time tak data "fresh" maana jaayega — is dauraan koi API call nahi hogi.
> `gcTime` (Garbage Collection): Agar component unmount ho jaaye toh kitni der baad memory se data delete hoga. Default 5 min hai.
> Example: `staleTime: 10min, gcTime: 30min` → 10 min tak fresh, phir stale, 30 min baad memory clear.

**Q4. isLoading aur isFetching mein kya fark hai?**
> `isLoading`: Sirf PEHLI baar true hota hai jab cache mein koi data nahi hai — skeleton dikhaao.
> `isFetching`: Jab bhi API call ho raha ho (pehli baar, background refresh, manual refetch) — subtle spinner dikhaao.
> Rule: Loading skeleton → `isLoading` | Refresh indicator → `isFetching && !isLoading`

**Q5. placeholderData kya karta hai?**
> Jab queryKey change ho (jaise role switch) tab naya data aane tak purana data dikhata hai. `(previousData) => previousData` pattern se UX smooth rehta hai — sudden blank screen nahi aati. Pehle yahi `keepPreviousData` option tha, v5 mein `placeholderData` function ban gaya.

**Q6. Cache invalidation kab aur kaise karte hain?**
> Jab data change ho jaaye (POST/PUT/DELETE ke baad), cache invalidate karo taaki next fetch fresh data le.
> ```js
> queryClient.invalidateQueries({ queryKey: ['skill-gaps'] })
> ```
> `invalidateQueries` sabhi matching queries ko "stale" mark karta hai — next access pe refetch hogi.

**Q7. useQueryClient hook ka kya use hai?**
> `useQueryClient()` se `queryClient` instance milta hai jisse tum programmatically cache ko control kar sakte ho:
> - `invalidateQueries()` → stale mark karo
> - `setQueryData()` → manually data set karo
> - `prefetchQuery()` → pehle se fetch karo
> - `removeQueries()` → delete karo

**Q8. React Query aur useState + useEffect approach mein kya difference hai?**
> useState + useEffect approach mein: manual loading/error state, no caching, duplicate requests possible, manually retry karna padta hai.
> React Query: automatic caching, deduplication (ek hi time mein ek hi request), background sync, automatic retry, stale-while-revalidate — sab built-in hai.

**Q9. Server state vs Client state kya hai?**
> `Client state`: UI ka local state — modal open/closed, selected tab, form input values. Iske liye `useState`/`useReducer` use karo.
> `Server state`: Backend se aata data — user profile, skill gaps, jobs list. Iske liye React Query use karo.
> Dono ko alag rakhna important hai — React Query sirf server state ke liye hai.

**Q10. Query deduplication kya hota hai?**
> Agar multiple components ek saath same `queryKey` ke saath `useQuery` call karein, React Query sirf EK API request bhejta hai — aur result dono ko deta hai. Bina React Query ke dono components alag alag requests bhejte, 2x server load hota.

**Q11. refetchOnWindowFocus kya karta hai? Humne band kyun kiya?**
> Default true hai — jab user doosra tab se wapas aaye toh React Query automatically refetch karta hai (data fresh rakhne ke liye). Humne `refetchOnWindowFocus: false` kiya kyunki hamare Gemini API calls slow aur costly hain — har tab switch pe call nahi chahiye.

**Q12. retry option kya karta hai?**
> API fail hone par React Query automatically retry karta hai. Default 3 baar. Humne `retry: 1` kiya — sirf ek retry, taki user zyada wait na kare agar server genuinely down hai.

**Q13. useQuery mein `enabled` option kya hota hai?**
> ```js
> useQuery({
>   queryKey: ['profile'],
>   queryFn: fetchProfile,
>   enabled: !!userId,  // sirf tab fetch karo jab userId ho
> })
> ```
> `enabled: false` hone par query run nahi hoti. Useful hai jab kuch condition puri hone par hi fetch karna ho.

**Q14. Background refetch kab hota hai?**
> React Query automatically background refetch karta hai jab:
> 1. Data stale ho jaaye aur component dobara mount ho
> 2. Tab focus ho (agar `refetchOnWindowFocus: true`)
> 3. Network reconnect ho (`refetchOnReconnect: true`)
> 4. `refetchInterval` set ho (polling)
> Stale data turant dikhta hai, naya data background mein aata hai — seamless UX.

**Q15. React Query aur Redux mein kya choose karein?**
> React Query → Server se aane wala data (API calls, caching, sync)
> Redux → Complex client-side state jo multiple components share karein (user preferences, UI state, shopping cart)
> Aajkal recommendation: React Query + useState (ya Zustand) — Redux ko avoid karo jab tak genuinely zarurat na ho. React Query server state ke liye Redux se far better hai.
