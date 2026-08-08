import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


async def analyze_text(text: str):

    prompt = f"""
You are an AI assistant for teachers working with neurodivergent students.

Analyze the following student statement.

Return ONLY valid JSON.

Student:
{text}

Format:

{{
    "emotion":"",
    "confidence":0,
    "simplified":"",
    "suggestions":[
        "",
        "",
        ""
    ]
}}
"""

    response = model.generate_content(prompt)

    return response.text