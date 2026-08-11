# Cache Pattern — CareerMind AI

## Skill Gap Cache — Kaise kaam karta hai

```
Page open hua
    ↓
cache.get('skill_gaps_default') check karo
    ├── Fresh (< 10 min) → Data dikhao, NO API call ✅
    ├── Stale (>= 10 min) → Purana data TURANT dikhao + background mein API call 🔄
    └── No cache → Skeleton dikhao + API call 🌀

API call succeed hone ke baad → cache.set(key, data) → 10 min ke liye save
```

## Cache Keys

```js
skill_gaps_default           // Profile default role (no ?role= param)
skill_gaps_Backend Developer // Backend Developer role
skill_gaps_AI Engineer       // AI Engineer role
skill_gaps_Full Stack ...    // etc.
```

## Skills ya Profile Update hone par Cache Kaise Clear Karein

Jab bhi user skills add/remove kare ya profile update kare — cache invalidate karo:

```js
import cache from '../utils/cache';

// Skills add/remove karne ke baad
cache.clearAll('skill_gaps_');   // sabhi role caches delete
cache.clearAll('career_dna_');   // career DNA cache bhi delete (skills se connected)
```

## Frontend mein Cache Clear karne ke jagah

| Event | Cache clear karna hai |
|-------|-----------------------|
| Skill add kiya | `cache.clearAll('skill_gaps_')` |
| Skill remove kiya | `cache.clearAll('skill_gaps_')` |
| Career goal update | `cache.clearAll('skill_gaps_')` |
| Profile experience update | `cache.clearAll('career_dna_')` |

## Force Refresh Button

SkillGaps page par ek ↺ button hai. Click karo → cache delete + fresh API call.

## TTL Change karna ho toh

`cache.js` mein:
```js
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes — change karo yahan
```
