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
            
    username = profile.github_username
    headers = {'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'SkillForgeAI'}
    user_resp = requests.get(f'https://api.github.com/users/{username}', headers=headers, timeout=10)
    if user_resp.status_code == 404:
        return Response({"status": "error", "message": "GitHub user not found"}, status=404)
        
    # Process repositories & compute contribution streak...
```

---

## ❓ 10 In-Depth Technical Interview Questions & Answers

### Q1: GitHub Public API bina OAuth Token ke kitne requests allow karta hai aur Production me limit bypass kaise ki jaati hai?
**Detailed Answer (Bhai Language):** 
Unauthenticated IP requests ki rate limit **60 requests per hour per IP** hoti hai. Production me 1,000+ users ke liye ye 60 requests seconds me exhaust ho jaayengi.
Is problem ko 2 methods se fix kiya jata hai:
1. **GitHub Personal Access Token (PAT) / OAuth Token Header**: Authenticated request header (`Authorization: Bearer <PAT>`) per-hour limit ko **5,000 requests/hour** kar deta hai.
2. **24-Hour Database Caching**: Hum user ka fetched output `UserProfile.github_data` me save karte hain. Agar 24 hours ke andar repeat request aati hai, to standard response DB से `<15ms` me return ho jata hai, zero GitHub API calls spend hue!

---

### Q2: Aggregation Algorithm repositories me Language Percentage calculations kaise karta hai?
**Detailed Answer (Bhai Language):** 
1. Backend user ke top 30 non-forked original repos fetch karta hai (`/users/{username}/repos?type=owner`).
2. Har repo key `language` check karke dictionary map count compute hoti hai:
   ```python
   lang_counts = {}
   for repo in repos:
       if not repo.get('fork'):
           lang = repo.get('language')
           if lang:
               lang_counts[lang] = lang_counts.get(lang, 0) + 1
   ```
3. Total language occurrences $T = \sum \text{counts}$ calculate karke percentage yield hota hai:
   $$\text{Percentage}_i = \text{round}\left(\frac{\text{count}_i}{T} \times 100\right)$$

---

### Q3: GitHub API call Frontend se direct kyu nahi karni chahiye?
**Detailed Answer (Bhai Language):** 
- **Security Vulnerability**: Server Personal Access Tokens frontend bundle me hardcode karne se leak ho sakte hain.
- **Client IP Exhaustion**: Mobile users ya shared Wi-Fi IPs shared 60 req/hr rate limit instant hit kar denge.
- **Data Normalization & AI Scoring**: Gemini AI code quality rating aur DB cache backend logic par hi execute hona architecture-wise optimal hota hai.

---

### Q4: GitHub 24-Hour Cache Invalidation flow code level par kaise enforce hui?
**Detailed Answer (Bhai Language):** 
`UserProfile` DB model me `github_data` (JSONField) aur `github_data_updated` (DateTimeField) timestamps contain hote hain.
```python
force = request.query_params.get('force') == 'true'
if not force and profile.github_data and profile.github_data_updated:
    time_diff = timezone.now() - profile.github_data_updated
    if time_diff < timedelta(hours=24):
        return Response({"status": "success", "data": profile.github_data, "cached": True})
```
Agar user explicit `"Refresh"` button par click kare (`?force=true`), tabhi stale cache invalidate karke fresh GitHub call fire hoti hai.

---

### Q5: Invalid GitHub Username Enter hone par Robust Error Handling kaise work karti hai?
**Detailed Answer (Bhai Language):** 
GitHub API Response Status Code `404 Not Found` catch kiya jata hai. Backend generic internal server crash (`500`) throw karne ki jagah standard client JSON response return karta hai:
```json
{ "status": "error", "message": "GitHub user not found. Check the username and try again." }
```
HTTP status `404` status code ke saath, jisse frontend error message toast UI render kar sakta hai.

---

### Q6: GitHub Events API se Real Consecutive Contribution Streak kaise extract hoti hai?
**Detailed Answer (Bhai Language):** 
`https://api.github.com/users/{username}/events?per_page=100` Call karke past 90 days ke events JSON structure se distinct dates `YYYY-MM-DD` ka Set create kiya jata hai:
```python
activity_dates = set(ev['created_at'][:10] for ev in events if 'created_at' in ev)
```
Phir Today's Date se backward loop initiate hota hai:
```python
today = datetime.date.today()
streak = 0
curr = today
if curr.isoformat() not in activity_dates:
    curr = today - datetime.timedelta(days=1)

while curr.isoformat() in activity_dates:
    streak += 1
    curr -= datetime.timedelta(days=1)
```
Agar commit today ya yesterday tha, to consecutive chain streak count increment hota rehta hai.

---

### Q7: Aggregation me Forked Repositories Filter out karna kyu Mandatory hai?
**Detailed Answer (Bhai Language):** 
Forked repos me original author kisi aur developer ka hota hai (e.g. `facebook/react`). Agar forked repos include kar liye jaaein, to candidate ka actual skill evidence fake score inflate karega. `repo.get('fork') == False` filter candidate dwara self-created repos ensure karta hai.

---

### Q8: Large Raw API Payloads Frontend performance ko kaise degrade karte hain?
**Detailed Answer (Bhai Language):** 
GitHub Public API single repo call me 80+ unused metadata attributes (`node_id`, `keys_url`, `assignees_url`, `blobs_url`) return karti hai (payload size ~500KB). Backend normalization step strictly 5 required attributes extract karta hai (`name`, `stars`, `language`, `updated`, `url`), reducing network payload size from 500KB to 4KB (99% reduction)!

---

### Q9: Third-party HTTP 429 (Too Many Requests) Response handle karne ka production pattern kya hai?
**Detailed Answer (Bhai Language):** 
Exponential Backoff with Circuit Breaker pattern:
If status is `429`, extract `Retry-After` header value, log telemetry warning, aur stale DB cache return kar do along with user warning: `"Live GitHub sync throttled by GitHub. Displaying recent cached snapshot."`

---

### Q10: Gemini API Prompt Engine JSON output formatting guarantee kaise karta hai?
**Detailed Answer (Bhai Language):** 
Prompt me explicit JSON Contract schema define ki jaati hai:
```text
Return ONLY valid JSON matching this exact structure:
{
  "code_quality_score": 85,
  "summary": "Strong Python evidence found."
}
Do NOT include markdown backticks or explanations.
```
Backend response recibir hone par `clean_json_response()` utility markdown backticks (` ```json `) strip karke `json.loads()` parse karti hai with try-except fallback block.
