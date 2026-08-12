# Day 25: API Performance Tuning & Load Management 🚀

## 📌 Context & Concept Summary
Bhai, API Response Time (Latency) direct User Experience aur Google SEO rank determine karta hai. Benchmark: API sub-200ms respond karni chahiye. Is module me humne Response Compression, JSON Payload Minification, Asynchronous tasks, aur Throttling engineering tuning samjhi.

---

## 🛠️ Performance Tuning Roadmap

1. **GZip / Brotli Middleware Compression**: HTTP Response Payload size 70% compress ho jaata hai.
2. **Payload Minification**: Unused verbose fields API serializer outputs se strip kar diye jaate hain.
3. **Database Pre-computation**: Aggregations (Readiness score, XP, Streaks) on-the-fly Heavy calculation avoid karne ke liye pre-computed fields DB JSON me cached rehte hain.
4. **Asynchronous External Calls**: Third-party APIs (Gemini / GitHub) timeout limits (`timeout=3`) set karke non-blocking workers implement kiye jaate hain.

---

## 💻 Compression & Tuning Setup (`settings.py`)
```python
MIDDLEWARE = [
    'django.middleware.gzip.GZipMiddleware', # Compresses responses > 200 bytes
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # ...
]

# JSON Response Minification
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer', # Compact JSON format
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}
```

---

## ❓ 10 Technical Interview Questions & Answers

### Q1: Latency aur Throughput me kya difference hai?
**Answer:** `Latency`: Single API request complete hone me laga total time (e.g., 120ms). `Throughput`: System per second kitne requests process kar sakta hai (RPS - Requests Per Second).

### Q2: GZip Middleware JSON response sizes par kitna effect daalta hai?
**Answer:** Textual JSON responses me redundant key strings hote hain. GZip compression 60% se 80% payload size reduce kar deta hai (e.g., 100KB payload reduces to 22KB).

### Q3: TTFB (Time To First Byte) kya hota hai?
**Answer:** Browser dwara HTTP Request initiate karne se lekar server se first response byte receive hone tak ka total network + processing duration.

### Q4: Synchronous vs Asynchronous API Processing me kya farak hai?
**Answer:** Synchronous processing user request thread ko block karke long-running execution ka wait karti hai. Asynchronous execution background task queue (Celery/Redis) ko job handoff karke immediate acknowledgement return karti hai.

### Q5: Timeout parameters external API requests (requests.get) me kyu critical hote hain?
**Answer:** Without `timeout=5`, agar third-party server (GitHub/Gemini) hang ya drop ho jaaye to server thread indefinitely block rahega, exhaustion leading to full server crash.

### Q6: REST API Payload Minification kya hota hai?
**Answer:** Redundant fields, whitespace, aur extra nested references response JSON se remove karna to ensure minimum network packet size.

### Q7: CDN (Content Delivery Network) API performance me kaise help karta hai?
**Answer:** Static assets and cached API GET responses user ke nearest Edge Server (POP - Point of Presence) se serve karke origin server hit aur network latency drastically reduce karta hai.

### Q8: Load Balancer (Nginx/HAProxy) ka roll high traffic me kya hota hai?
**Answer:** Incoming requests multiple backend application instances (Gunicorn workers) me round-robin/least-connections algorithm se distribute karta hai to prevent single instance overloading.

### Q9: Database Connection Leak kya hota hai aur isko kaise fix karte hain?
**Answer:** Jab code DB connection open karke explicit close ya return call miss kar deta hai. Django middleware automatic request complete hone par DB connection close/recycle guarantee karti hai.

### Q10: Benchmark Stress Testing tools kon kon se hote hain?
**Answer:** `Locust` (Python-based), `k6` (JS-based), `Apache JMeter`, `wrk`. Inse thousands of virtual concurrent users simulate karke API throughput scale test hoti hai.
