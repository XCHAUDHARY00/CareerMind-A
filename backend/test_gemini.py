import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print("Key found:", api_key is not None)
if api_key:
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel('gemini-2.5-flash-preview')
        response = model.generate_content("Hello")
        print("Success:", response.text)
    except Exception as e:
        print("Error:", str(e))
