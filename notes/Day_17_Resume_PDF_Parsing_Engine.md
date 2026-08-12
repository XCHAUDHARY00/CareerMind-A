# Day 17: Resume PDF Parsing & PyPDF2 Engine 📄

## 📌 Context & Concept Summary
Bhai, modern hiring ATS (Applicant Tracking System) software se hoti hai. Humne CareerMind AI me ek PDF Upload & Analysis module banaya hai jo PyPDF2 library ke dwara resume se pure raw text extract karta hai, aur Gemini AI engine us text ka breakdown, ATS readiness score, skill relevance, aur actionable tips return karta hai.

---

## 🛠️ Key Technical Architecture
1. **Multipart Form-Data Handling**: Django REST Framework me `MultiPartParser` aur `FormParser` parse karte hain binary file uploads.
2. **PyPDF2 Text Extraction**: `PyPDF2.PdfReader(io.BytesIO(file_bytes))` se pages loop karke raw plain text memory me string format me extract karte hain.
3. **Smart Text Trimming**: Token limit & API cost optimize karne ke liye max 3,000 characters slice kiye jaate hain.
4. **Structured JSON Output Prompting**: Gemini prompt explicit JSON schema specify karta hai (`ats`, `skill_relevance`, `project_strength`, `ai_tips`).

---

## 💡 Real Life Analogy
Socho tum kisi x-ray lab me gaye ho. Doctor (PyPDF2) x-ray machine me film (PDF resume) daalta hai aur bone structure ka raw snapshot (Text) nikalta hai. Phir Specialist Doctor (Gemini AI) report dekh kar scorecard aur prescription (ATS Score + Tips) likh ke deta hai!

---

## 💻 Backend Implementation Code Snippet (`views.py`)
```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    file = request.FILES.get('resume')
    if not file or not file.name.lower().endswith('.pdf'):
        return Response({"status": "error", "message": "Only PDF files supported"}, status=400)
    
    # Read PDF text using PyPDF2
    pdf_bytes = file.read()
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    text_parts = [page.extract_text() for page in reader.pages if page.extract_text()]
    resume_text = '\n'.join(text_parts).strip()
    
    # Gemini Analysis & DB Cache
    profile = request.user.profile
    profile.resume_text = resume_text
    profile.resume_analysis = analysis
    profile.save()
    return Response({"status": "success", "data": analysis})
```

---

## ❓ 10 Technical Interview Questions & Answers

### Q1: PyPDF2 raw image PDF (scanned PDF) se text Extract kar sakta hai?
**Answer:** Nahi, PyPDF2 sirf digital/text-based PDFs se text extraction kar sakta hai. Scanned PDF/Image PDFs ke liye OCR (Tesseract / AWS Textract) ki zaroorat hoti hai.

### Q2: Multipart/form-data kya hota hai aur application/json se kaise alag hai?
**Answer:** `application/json` sirf text data ke liye hota hai. Binary files (PDF, images) ko transmit karne ke liye `multipart/form-data` encoding boundaries ka use karti hai jisse file segments Stream format me pass hote hain.

### Q3: Large PDF file upload se Memory crash/DoS attack kaise rokte hain?
**Answer:** Backend upload validation se:
1. `file.size > 10 * 1024 * 1024` (10MB Max Limit enforce).
2. Django `FILE_UPLOAD_MAX_MEMORY_SIZE` config set karke disk swapping monitor karna.

### Q4: PyPDF2, pdfplumber aur pypdf me kya difference hai?
**Answer:** `PyPDF2` lightweight aur fast text extraction ke liye ideal hai. `pdfplumber` tables aur layout coordinates preserve karti hai (heavy processing). `pypdf` PyPDF2 ka modern active fork hai.

### Q5: Gemini API prompt me `no markdown backticks` kyu insist karte hain?
**Answer:** LLMs by default JSON ko ` ```json ... ``` ` wrappers me wrap kar dete hain. `json.loads()` fail na ho iske liye strict prompt + backend stripping (`replace('```json','')`) zaroori hoti hai.

### Q6: Resume Text trimming (3,000 chars) kyu ki gayi hai?
**Answer:** Resumes aam taur par 1-2 pages ke hote hain (~2,000–3,000 chars). Rest metadata/overflow tokens cut-off karne se Gemini API input tokens drop hote hain, jisse API cost 70% decrease hoti hai aur latency fast ho jaati hai.

### Q7: If PyPDF2 returns empty string (`len(text) < 50`), application kya handle karti hai?
**Answer:** User ko error response return karti hai: `"Could not extract text from PDF. Try a text-based PDF."` jisse invalid AI processing budget waste na ho.

### Q8: Resume analysis profile DB me store karne ka kya fayda hai?
**Answer:** User jab bhi `/resume` page open kare, dobara Gemini call ki zaroorat nahi parti. Data direct `profile.resume_analysis` JSONField se instantly return ho jata hai (Zero API Cost on revisit).

### Q9: DRF me `parser_classes([MultiPartParser, FormParser])` decorator kyu add kiya gaya?
**Answer:** DRF by default JSON input expect karta hai. Binary file upload request me request payload parse karne ke liye MultiPartParser specify karna mandatory hota hai.

### Q10: ATS (Applicant Tracking System) scoring criteria AI me kaise model hoti hai?
**Answer:** Prompt in 5 dimensions par weightage deta hai:
- Keyword Relevance (Skill match)
- Quantified Impact Statements (e.g. "Reduced latency by 40%")
- Formatting & Section structure
- Role Alignment
- Project quality evidence
