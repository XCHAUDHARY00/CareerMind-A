# Day 16: GitHub Intelligence & Public API Aggregation 🐙

## 📌 Context & Concept Summary
Bhai, resume par direct skills likhna easy hota hai, par real world me recruiter validation chahta hai. **GitHub Intelligence Engine** user ke GitHub public profile, public repositories, commit activity, aur languages stats ko live fetch karta hai aur AI (Gemini) ke dwara profile score aur evidence consistency generate karta hai.

---

## 🛠️ Key Technical Architecture
1. **GitHub Public API Integration**: Requests `https://api.github.com/users/{username}` & `/repos` without needing OAuth for public profiles.
2. **24-Hour Cache Strategy**: GitHub rate limits standard requests (60 req/hour for unauthenticated). Hum cached result ko `UserProfile.github_data` me save karte hain aur 24 hours tak direct DB cache se return karte hain (`github_data_updated`).
3. **Language Stats Aggregation**: Every repo ka primary language count aggregate karke percentage calculate karta hai.
4. **AI Evidence Matching**: Gemini AI check karta hai ki resume aur user profile skills real GitHub repositories me dikh rahe hain ya nahi.

---

## 💡 Real Life Analogy
Socho tum kisi hotel me chef ki job ke liye gaye ho. Tumne bol diya "Mujhe Chinese & Italian mast banana aata hai". HR kehta hai: *"Chalo tumhari kitchen ki video aur past customer reviews dikhao!"*
GitHub link karna bilkul waisa hi hai — code repos aapke real working evidence ban jaate hain!

---

## 💻 Backend Implementation Code Snippet (`views.py`)
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyze_github(request):
    profile = request.user.profile
    if not profile.github_username:
        return Response({"status": "error", "message": "GitHub not linked"}, status=400)
    
    # 24h Cache Check
    if profile.github_data and profile.github_data_updated:
        if timezone.now() - profile.github_data_updated < timedelta(hours=24):
            return Response({"status": "success", "data": profile.github_data, "cached": True})
            
    # Fetch from GitHub API...
    username = profile.github_username
    headers = {'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'CareerMindAI'}
    user_resp = requests.get(f'https://api.github.com/users/{username}', headers=headers)
    # ... Process languages & AI score ...
```

---

## ❓ 10 Technical Interview Questions & Answers

### Q1: GitHub Public API bina token ke kitne requests allow karta hai?
**Answer:** Unauthenticated API requests ki limit **60 requests per hour per IP** hoti hai. Authenticated requests (OAuth/Personal Access Token) me ye limit **5,000 requests per hour** hoti hai.

### Q2: GitHub API se Language Percentage kaise calculate karte hain?
**Answer:** Multi-repo aggregation se. Saare repos ke `language` key ko count karke `(language_count / total_repos_with_language) * 100` formula use karte hain.

### Q3: Direct GitHub API call frontend se kyu nahi karni chahiye?
**Answer:** 
1. Client-side IP rate limiting hit ho sakti hai.
2. Gemini AI analysis and DB caching logic backend par execute hona secure aur cost-effective hota hai.
3. CORS policies aur API keys backend par safely handle hoti hain.

### Q4: GitHub 24-hour cache invalidation kaise implement hui?
**Answer:** `UserProfile` model me `github_data` (JSONField) aur `github_data_updated` (DateTimeField). Access time me check hota hai `timezone.now() - github_data_updated < timedelta(hours=24)`. Agar true hai, API call bypass hoti hai!

### Q5: User invalid GitHub username enter kare to error handling kaise hogi?
**Answer:** GitHub API `404 Not Found` response code return karega. Backend catch karke frontend ko standard error `{ "status": "error", "message": "GitHub user not found" }` (HTTP 404) bhejta hai.

### Q6: GitHub Events API se streak kaise compute hoti hai?
**Answer:** `https://api.github.com/users/{username}/events` Call karke past events ke `created_at` timestamp se distinct `YYYY-MM-DD` dates extraction hota hai. Today/yesterday se backward loop run karke continuous consecutive days calculate kiye jaate hain.

### Q7: Aggregation me repository forks filter out kyu karte hain?
**Answer:** Forked repos me kisi aur ka original code hota hai. User ke real skills measure karne ke liye `repo.get('fork') == False` (own original repos) hi process karte hain.

### Q8: Large API response payloads frontend performance ko kaise affect karte hain?
**Answer:** Extra network latency aur memory overhead create karte hain. Hum backend me raw GitHub response (jisme 100+ fields hoti hain) me se sirf required fields (`name`, `stars`, `language`, `url`, `description`) filter karke clean JSON return karte hain.

### Q9: API rate limit status code 429 response catch karne par kya fallback hona chahiye?
**Answer:** HTTP 429 (Too Many Requests) aane par stale cached data serve karte hain ya user ko rate limit notification bhejte hain (`Retry-After` header check karke).

### Q10: Gemini API integration me response JSON clean karna kyu zaroori hota hai?
**Answer:** LLMs aksar markdown formatting (` ```json ... ``` `) me response dete hain. `clean_json_response()` utility backticks ko strip karke clean JSON string ko `json.loads()` se parse karti hai.
