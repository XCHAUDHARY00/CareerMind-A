# 🏗️ SkillForge AI — Enterprise System Architecture & Master Engineering Blueprint

Welcome to the official technical architecture guide for **SkillForge AI** (Next-Generation AI Career Operating System for Software Engineers). This document details every layer of our stack, security design, data flow, AI prompt orchestration, and caching mechanics.

---

## 🎨 Master End-to-End System Architecture Diagram

```mermaid
graph TD
    %% Custom Styling Definitions
    classDef clientStyle fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff
    classDef secStyle fill:#701a75,stroke:#f0abfc,stroke-width:2px,color:#fff
    classDef backendStyle fill:#0f766e,stroke:#2dd4bf,stroke-width:2px,color:#fff
    classDef aiStyle fill:#831843,stroke:#f472b6,stroke-width:2px,color:#fff
    classDef dbStyle fill:#1e3a8a,stroke:#60a5fa,stroke-width:2px,color:#fff

    subgraph CLIENT_TIER ["📱 CLIENT LAYER — REACT 18 + VITE + TAILWIND V4"]
        UI["React SPA UI Pages<br/>(Landing, Dashboard, DNA, Gaps, Roadmap, GitHub, Resume, Interview)"]:::clientStyle
        ThemeCtx["ThemeContext<br/>(Light 🌞 / Dark 🌙 Token Engine)"]:::clientStyle
        AuthCtx["AuthContext<br/>(JWT State, Dynamic XP & Streak)"]:::clientStyle
        Axios["Axios Interceptor<br/>(Silent 401 JWT Refresh Queue)"]:::clientStyle
        
        UI --> ThemeCtx
        UI --> AuthCtx
        UI --> Axios
    end

    subgraph SECURITY_TIER ["🛡️ SECURITY & GATEWAY LAYER"]
        CORS["CORS Middleware<br/>(Trusted Origins Protection)"]:::secStyle
        JWTAuth["SimpleJWT Authentication<br/>(Bearer Access Token + 7d Refresh)"]:::secStyle
        Throttle["DRF Rate Limiter<br/>(Throttle Anon: 100/day, User: 1000/day)"]:::secStyle
        
        Axios --> CORS
        CORS --> JWTAuth
        JWTAuth --> Throttle
    end

    subgraph BACKEND_TIER ["🚀 APPLICATION SERVICE LAYER — DJANGO REST FRAMEWORK"]
        URLRouter["URL Dispatcher Router"]:::backendStyle
        
        subgraph SERVICES ["Backend Business Logic Services"]
            ProfileSvc["Profile & Settings Controller"]:::backendStyle
            DNASvc["Career DNA Analysis Engine"]:::backendStyle
            GapSvc["Skill Gap Diagnostic Engine"]:::backendStyle
            RoadmapSvc["Weekly Roadmap Generator"]:::backendStyle
            GitHubSvc["GitHub Intelligence & Streak Engine"]:::backendStyle
            ResumeSvc["Resume PDF Extractor & ATS Engine"]:::backendStyle
            InterviewSvc["Interactive Mock Interview Engine"]:::backendStyle
        end

        Throttle --> URLRouter
        URLRouter --> ProfileSvc
        URLRouter --> DNASvc
        URLRouter --> GapSvc
        URLRouter --> RoadmapSvc
        URLRouter --> GitHubSvc
        URLRouter --> ResumeSvc
        URLRouter --> InterviewSvc
    end

    subgraph EXTERNAL_TIER ["🌐 AI & THIRD-PARTY EXTERNAL SERVICES"]
        GeminiFlash["Google Gemini AI Engine<br/>(gemini-flash-latest)"]:::aiStyle
        GitHubAPI["GitHub Public REST API<br/>(Repos, Stars, Event Timestamps)"]:::aiStyle
        PyPDF2Stream["PyPDF2 Binary Stream Extractor"]:::aiStyle
        
        DNASvc <-->|"Structured Prompting"| GeminiFlash
        GapSvc <-->|"Gap Rating Prompting"| GeminiFlash
        RoadmapSvc <-->|"Milestone Plan Prompting"| GeminiFlash
        GitHubSvc <-->|"Fetch Public Repos & Stars"| GitHubAPI
        GitHubSvc <-->|"Calculate Commit Streaks"| GitHubAPI
        GitHubSvc <-->|"Profile Code Quality Scoring"| GeminiFlash
        ResumeSvc --> PyPDF2Stream
        ResumeSvc <-->|"ATS Score & Improvement Prompt"| GeminiFlash
        InterviewSvc <-->|"Q&A Generation & Feedback"| GeminiFlash
    end

    subgraph DB_TIER ["🗄️ PERSISTENCE LAYER — SUPABASE POSTGRESQL / SQLITE"]
        UserProfileDB[("UserProfile Table<br/>- career_dna_data (JSON)<br/>- skill_gaps_data (JSON)<br/>- roadmap_data (JSON)<br/>- github_data (JSON)<br/>- resume_analysis (JSON)<br/>- github_username<br/>- linkedin_url")]:::dbStyle
        SkillsDB[("Skills Table")]:::dbStyle
        EduDB[("Educations Table")]:::dbStyle
        GoalDB[("CareerGoals Table")]:::dbStyle
        InterviewDB[("InterviewSession & Questions Tables")]:::dbStyle
        
        ProfileSvc <--> UserProfileDB
        DNASvc <--> UserProfileDB
        GapSvc <--> UserProfileDB
        RoadmapSvc <--> UserProfileDB
        GitHubSvc <--> UserProfileDB
        ResumeSvc <--> UserProfileDB
        InterviewSvc <--> InterviewDB
        ProfileSvc <--> SkillsDB
        ProfileSvc <--> EduDB
        ProfileSvc <--> GoalDB
    end
```

---

## 📌 Layer-by-Layer Architectural Breakdown (In Bhai Language)

### 1. Client Layer (Frontend React SPA) 📱
- **Tech Stack**: React 18, Vite 8, Tailwind CSS v4, Framer Motion.
- **Theme Engine (`ThemeContext.jsx`)**: System CSS Variables (`var(--bg-card)`, `var(--text-primary)`) manage Light 🌞 and Dark 🌙 modes on the root document level without page flicker or visual breakage.
- **Silent JWT Refresh Interceptor (`api.js`)**: Jab user ka short-lived JWT Access Token expire hota hai, Axios Response Interceptor HTTP 401 error catch karta hai, `failedQueue` me requests hold karta hai, `/api/token/refresh/` par refresh request bhejta hai, new token LocalStorage me update karta hai, aur seamless request retry execute karta hai! User ko kabhi pata nahi chalta ki token expire hua tha.

---

### 2. Security & Gateway Layer 🛡️
- **CORS Headers**: `django-cors-headers` middleware restricts API access to explicit frontend domains (`http://localhost:5173`).
- **SimpleJWT Authentication**: Enforces Bearer Access Token authentication on all protected REST views.
- **Rate Throttling**: Restricts unauthorized spam bots using Django REST Framework throttles (`anon: 100/day`, `user: 1000/day`).

---

### 3. Application Services & Business Logic 🚀

#### A. Career DNA Engine (`DNASvc`)
- Analyzes user skills, experience, and target role.
- Calls Gemini AI (`gemini-flash-latest`) to compute radar dimensions, career matches, and personality traits.
- Caches payload in `UserProfile.career_dna_data` ($0 API cost on revisit).

#### B. Skill Gap Diagnostic Engine (`GapSvc`)
- Compares user skills against market requirements for the selected target role.
- Generates priority ratings (`High`, `Medium`, `Low`) with reasons.
- Caches payload in `UserProfile.skill_gaps_data` ($0 API cost on revisit).

#### C. GitHub Intelligence & Contribution Streak Engine (`GitHubSvc`)
- Calls GitHub REST API (`https://api.github.com/users/{username}`) to aggregate public repos, total stars, and language percentages.
- Calls `/users/{username}/events` to parse distinct activity dates (`YYYY-MM-DD`) and computes real consecutive daily contribution streaks.
- Caches analysis for 24 hours (`github_data_updated`).

#### D. Resume PDF Parsing Engine (`ResumeSvc`)
- DRF `MultiPartParser` accepts PDF uploads.
- `PyPDF2.PdfReader` extracts raw text from binary streams.
- Limits text to 3,000 characters (reducing token costs by >70%).
- Gemini AI scores ATS readiness, skill relevance, and provides improvement tips.
- Caches analysis in `UserProfile.resume_analysis` ($0 API cost on revisit).

#### E. Mock Interview Simulator (`InterviewSvc`)
- `POST /api/interview/start/`: Creates `InterviewSession`, asks Gemini for the initial role-specific question.
- `POST /api/interview/answer/`: Passes chat context to Gemini, evaluates answer score, returns next question.
- `POST /api/interview/end/`: Concludes session, computes final technical & communication scores.

#### F. Derived AI Projects (Zero Cost Feature)
- Frontend client derives project specifications directly from cached skill gaps.
- **Zero Gemini API calls forever!**

---

### 4. Database & Persistence Layer 🗄️
- **Supabase PostgreSQL / SQLite**: Stores User profiles, relational skill bindings, education history, goals, and interview sessions.
- **JSONFields**: Stores heavy cached AI payloads (`career_dna_data`, `skill_gaps_data`, `roadmap_data`, `github_data`, `resume_analysis`), delivering sub-15ms response times on cached GET endpoints.

---

### 5. Multi-Tier Caching & Performance Matrix ⚡

```
[User Request]
      │
      ├──> Tier 1: Browser LocalStorage Cache (0ms latency)
      ├──> Tier 2: Database PostgreSQL JSONField Cache (15ms latency)
      └──> Tier 3: Google Gemini API (gemini-flash-latest) (Sub-second response -> Saves to DB)
```

---

<div align="center">
  <p>SkillForge AI Architectural Blueprint © 2026</p>
</div>
