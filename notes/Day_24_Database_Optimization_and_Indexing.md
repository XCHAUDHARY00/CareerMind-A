# Day 24: Database Optimization & Indexing Strategies 🗄️

## 📌 Context & Concept Summary
Bhai, jab app me 100 users se 1,00,000 users grow hote hain, tab backend slow hone ka 90% reason Database Queries ka in-efficiency hona hota hai. N+1 queries, un-indexed lookups, aur unwanted bulk columns fetch karne se server response time 50ms se 5 seconds chala jaata hai.

---

## 🛠️ Optimization Blueprint

1. **N+1 Query Resolution**: Django ORM me `select_related()` (for ForeignKey/OneToOne) aur `prefetch_related()` (for ManyToMany) use karke single query join execution.
2. **Database Indexing**: Frequently searched columns (`github_username`, `user_id`, `created_at`) par `db_index=True` add karna.
3. **Selective Query Set**: `.only('id', 'username')` / `.values()` selectively columns load karne ke liye memory save karta hai.
4. **Bulk Database Operations**: `bulk_create()` & `bulk_update()` hundreds of database inserts 1 single SQL statement me execute karte hain.

---

## 💻 Code Comparison Snippet

```python
# ❌ BAD PRACTICE (Triggers 101 Database Queries!)
profiles = UserProfile.objects.all()
for p in profiles:
    print(p.user.username)  # Every loop fires 1 new SQL query!

# ✅ OPTIMIZED PRACTICE (Triggers ONLY 1 Joined SQL Query!)
profiles = UserProfile.objects.select_related('user').prefetch_related('skills').all()
for p in profiles:
    print(p.user.username)  # 0 additional queries fired!
```

---

## ❓ 10 Technical Interview Questions & Answers

### Q1: Database Index kya hota hai aur ye lookup fast kaise karta hai?
**Answer:** Database Index B-Tree (Binary Tree) data structure create karta hai table columns par. Full Table Scan ($O(N)$) karne ki jagah Index Logarithmic lookup ($O(\log N)$) time me exact record locate karta hai.

### Q2: N+1 Query Problem Django ORM me kya hoti hai?
**Answer:** Jab main model query $1$ query run karti hai, aur uske related models iterate karte waqt loop $N$ times individual SQL queries fire karta hai ($1 + N$ total queries).

### Q3: `select_related` vs `prefetch_related` me kya difference hai?
**Answer:** `select_related` SQL `JOIN` perform karta hai (Single SQL Query) for Single-Value Foreign Keys. `prefetch_related` 2 separate queries run karke Python level par in-memory join karta hai for Many-to-Many / Reverse Foreign Keys.

### Q4: Composite Index (Multi-column index) kab create karna chahiye?
**Answer:** Jab queries multiple fields saath me Filter/Sort karti hain (e.g. `WHERE status = 'completed' AND user_id = 5 ORDER BY created_at`).

### Q5: Har column par Index add kar dena accha kyu nahi hota?
**Answer:** Index Read speed badhata hai, par Write/Insert/Update speed slow kar deta hai kyunki har Data Modify hone par B-Tree re-index hoti hai. Extra disk space consumption bhi badhti hai.

### Q6: `django-debug-toolbar` / `connection.queries` ORM debugging me kaise help karte hain?
**Answer:** Exact executed SQL statements, Duplicate Queries count, aur execution time milliseconds me display karte hain.

### Q7: `db_index=True` Django model me add karne se migration kya karti hai?
**Answer:** Migration SQL statement execute karti hai: `CREATE INDEX idx_userprofile_github_username ON users_userprofile (github_username);`.

### Q8: `values()` aur `only()` methods Query performance kaise improve karte hain?
**Answer:** Extra heavy columns (jaise `resume_text` 100KB) select query se exclude karke Database I/O aur RAM usage 90% drop kar dete hain.

### Q9: `bulk_create` method looping `.save()` call se sasta kyu hai?
**Answer:** Loop me `.save()` 100 separate HTTP/TCP roundtrips and transactions karta hai. `bulk_create` 1 single `INSERT INTO table VALUES (...), (...), (...)` fire karta hai.

### Q10: Database Connection Pooling (`django-db-connection-pool` / PgBouncer) performance me kya roll play karta hai?
**Answer:** Har incoming HTTP request par new TCP Connection establish karne ka overhead (30-50ms) cut karke reusable database connection pool maintain karta hai.
