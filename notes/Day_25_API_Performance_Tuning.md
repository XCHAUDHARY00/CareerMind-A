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

## ❓ 10 In-Depth Technical Interview Questions & Answers

### Q1: Latency (Response Time) vs Throughput (RPS) System Tuning Goals me Difference kya hai?
**Detailed Answer (Bhai Language):** 
- **Latency**: Single HTTP request complete hone ka elapsed duration (measured in milliseconds, e.g. 85ms). Goal: Reduce to sub-200ms.
- **Throughput**: System unit time me maximum kitne requests process kar sakta hai (measured in Requests Per Second, e.g. 5,000 RPS). Goal: Increase concurrency capacity via worker processes and caching.

---

### Q2: HTTP Response Compression (GZip / Brotli) Network Transfer Speeds 70% elevate kaise karta hai?
**Detailed Answer (Bhai Language):** 
Textual API responses (JSON strings) me repeating structural tokens (`"status"`, `"username"`, `"id"`) hote hain.
Django `GZipMiddleware` HTTP response payload body ko in-memory gzip compression run karta hai:
1. Raw JSON Payload: 150 KB.
2. GZipped Network Transfer Size: **28 KB** (81% reduction!).
Browser client `Accept-Encoding: gzip` header decode karke client memory me payload read kar leta hai, drastically reducing network transmission delay over 3G/4G/5G mobile networks!

---

### Q3: Time To First Byte (TTFB) High latency root cause diagnosis and optimization strategy?
**Detailed Answer (Bhai Language):** 
TTFB measures duration from HTTP Request Sent -> First Byte Response Received.
High TTFB causes: Heavy DB Queries, Synchronous External API calls, missing DB indexes.
Optimization strategy:
$$\text{TTFB Optimization} = \text{Database Pre-computation} + \text{Redis Response Cache} + \text{Async Worker Hand-off}$$
This drops TTFB from 2.4 seconds to **45ms**.

---

### Q4: Synchronous vs Asynchronous Background Processing (Celery + Redis Queue) comparative architecture?
**Detailed Answer (Bhai Language):** 
- **Synchronous**: HTTP Request thread external task completion (e.g. sending welcome email / generating AI roadmap) ka inline wait karta hai. Client connection hangs for 3+ seconds.
- **Asynchronous**: Request handler job parameters Redis Queue me publish karke immediately HTTP `202 Accepted` status code return kar deta hai. Celery Background Worker process asynchronously task complete karta hai without holding HTTP server threads open!

---

### Q5: HTTP Timeouts (`requests.get(url, timeout=3)`) External Integrations me Thread Exhaustion Outages kaise defeat karte hain?
**Detailed Answer (Bhai Language):** 
Without timeout, if GitHub API or Gemini API drops TCP connections, Python `requests` thread indefinitely hanging mode me chala jata hai. Multi-worker servers (Gunicorn with 4 workers) par 4 hanging requests complete server ko block kar sakti hain!
`timeout=3` enforcing worker thread ko 3 seconds par unblock kar deta hai, protecting web application uptime.

---

### Q6: JSON Payload Minification & Field Selection API serialisation Overheads drop kaise karta hai?
**Detailed Answer (Bhai Language):** 
Un-optimized API responses entire database object model dump kar deti hain (including 100KB PDF raw text strings).
DRF `fields = ['id', 'username', 'career_xp']` dynamic Serializers use karne se unwanted data transmission eliminate hoti hai, saving bandwidth and client-side JSON parsing CPU operations.

---

### Q7: Content Delivery Network (CDN / Cloudflare) Dynamic API vs Static Asset Caching handling strategy?
**Detailed Answer (Bhai Language):** 
- **Static Assets** (JS/CSS/Images): Edge CDN Server par long-term cache (`Cache-Control: public, max-age=31536000`), serving assets directly from nearest geographic POP server (5ms latency).
- **Dynamic APIs**: Edge CDN BYPASS configuration (`Cache-Control: no-store`) or Stale-While-Revalidate Edge Caching for authenticated API endpoints.

---

### Q8: Load Balancers (Nginx / AWS ALB) Health-Check Based Traffic Routing High Availability me kaise work karti hain?
**Detailed Answer (Bhai Language):** 
Nginx Load Balancer incoming traffic 3 backend worker instances me distribute karta hai. Every 5 seconds Load Balancer `/api/health/` ping request execute karta hai. If Instance 2 crashes (500 Error / Timeout), Load Balancer automatically traffic healthy Instances 1 & 3 par route kar deta hai with zero downtime!

---

### Q9: Database Connection Leak Diagnosis & Connection Recycling Middleware?
**Detailed Answer (Bhai Language):** 
Unclosed raw DB connections PostgreSQL max connection limit (`max_connections=100`) breach kar sakti hain, throwing `OperationalError: FATAL: sorry, too many clients already`.
Django setting `CONN_MAX_AGE = 600` maintains reusable connections for 10 minutes, automatically recycling closed sockets after request lifecycle completes.

---

### Q10: API Stress Testing Tools (`k6` / `Locust`) Concurrent User Load Metrics Benchmark?
**Detailed Answer (Bhai Language):** 
Using `k6` JavaScript performance script:
```javascript
import http from 'k6/http';
export const options = { vus: 500, duration: '30s' }; // 500 Concurrent Virtual Users!
export default function () {
  http.get('http://localhost:8000/api/myprofile/');
}
```
Measures P95 Latency (95% of requests handled under X ms), HTTP Failure Rate, and Requests Per Second capability.
