import json
from bson import ObjectId
from datetime import datetime
from app.database.mongodb import reports_collection
from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq

from app.core.config import settings

router = APIRouter(
    prefix="/communication",
    tags=["Communication"]
)

client = Groq(api_key=settings.GROQ_API_KEY)


class CommunicationRequest(BaseModel):
    student_id: str
    text: str

@router.post("/analyze")
async def analyze(data: CommunicationRequest):

    prompt = f"""
You are an AI assistant helping teachers communicate with neurodivergent students.

Analyze this student's statement.

Student:
{data.text}

Return ONLY valid JSON.

Output:

{{
    "simplified": "",
    "emotion": "",
    "confidence": 90,
    "risk": "",
    "suggestion": ""
}}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        response_format={"type": "json_object"}
    )

    response = completion.choices[0].message.content.strip()

    print("RAW RESPONSE:")
    print(response)
    try:
        parsed = json.loads(response)

        await reports_collection.insert_one({

        "student_id": ObjectId(data.student_id),

        "report_type": "communication",

        "student_text": data.text,

        "simplified": parsed["simplified"],

        "emotion": parsed["emotion"],

        "confidence": parsed["confidence"],

        "risk": parsed["risk"],

        "suggestion": parsed["suggestion"],

        "created_at": datetime.utcnow()

        })

        return parsed

    except Exception as e:
        print(e)

    return {
        "simplified": response,
        "emotion": "Unknown",
        "confidence": 0,
        "risk": "Unknown",
        "suggestion": ""
    }