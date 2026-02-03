import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("❌ GEMINI_API_KEY not found in .env file")

# Gemini client
client = genai.Client(api_key=API_KEY)

def ask_gemini(message, language="en"):
    if language == "hi":
        prompt = f"किसानों के लिए सरल हिंदी में जवाब दें:\n{message}"
    else:
        prompt = f"Answer simply for farmers:\n{message}"

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print("Gemini Error:", e)
        return "AI service is temporarily unavailable."
