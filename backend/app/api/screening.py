from datetime import datetime, timezone
import json
import re
from app.core.config import settings
from app.database.mongodb import reports_collection, students_collection  # <-- FIX: Added students_collection import
from fastapi import APIRouter
from groq import Groq
from pydantic import BaseModel

router = APIRouter(prefix="/screening", tags=["Screening"])

client = Groq(api_key=settings.GROQ_API_KEY)


class ScreeningRequest(BaseModel):
    student_id: str
    observations: str


@router.post("/analyze")
async def analyze_screening(data: ScreeningRequest):

    prompt = f"""
You are an expert AI educational psychologist helping teachers support neurodivergent students.

Analyze the following student information.

Student Details:{data.observations}

Return ONLY valid JSON.

{{
    "emotion":"",
    "confidence":90,
    "risk":"",
    "summary":"",
    "recommendations":[
        "",
        "",
        "",
        "",
        ""
    ],
    "parent_advice":[
        "",
        "",
        ""
    ]
}}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        response_format={"type": "json_object"},
    )

    response = completion.choices[0].message.content.strip()

    # Remove markdown if present
    response = re.sub(r"```json|```", "", response).strip()

    try:
        print("RAW RESPONSE:")
        print(response)
        parsed = json.loads(response)

        # <-- FIX STARTS HERE: Fetch student name from DB to prevent PDF crash -->
        student = await students_collection.find_one({"_id": data.student_id})
        student_name = student.get("name", "Unknown Student") if student else "Unknown Student"
        # <-- FIX ENDS HERE -->

        # Save report to MongoDB using raw string for custom Student IDs (e.g. STD001)
        await reports_collection.insert_one(
            {
                "student_id": data.student_id,
                "student_name": student_name,  # <-- FIX: Saved student_name to DB
                "report_type": "screening",
                "observations": data.observations,
                "emotion": parsed.get("emotion", "Unknown"),
                "risk": parsed.get("risk", "Low"),
                "confidence": parsed.get("confidence", 90),
                "summary": parsed.get("summary", ""),
                "recommendations": parsed.get("recommendations", []),
                "parent_advice": parsed.get("parent_advice", []),
                "created_at": datetime.now(timezone.utc),
            }
        )

        return parsed

    except Exception as e:
        print("JSON ERROR:", e)
        print(response)

        # Fallback return in case the LLM breaks the JSON
        return {
            "emotion": "Unknown",
            "risk": "Unknown",
            "confidence": 0,
            "summary": "AI encountered an error parsing the request.",
            "recommendations": [],
            "parent_advice": [],
        }