from fastapi import APIRouter
from pydantic import BaseModel
from bson import ObjectId
from groq import Groq

from app.core.config import settings
from app.database.mongodb import (
    students_collection,
    reports_collection
)

router = APIRouter(
    prefix="/copilot",
    tags=["AI Copilot"]
)

client = Groq(api_key=settings.GROQ_API_KEY)


class CopilotRequest(BaseModel):
    student_id: str
    question: str


@router.post("/ask")
async def ask_copilot(data: CopilotRequest):

    # FIX 1: Search by the custom string "student_id" instead of MongoDB "_id"
    student = await students_collection.find_one(
        {"student_id": data.student_id}
    )

    if not student:
        return {
            "answer": "Student not found. Please check the Student ID and try again."
        }

    reports = []

    # FIX 2: Use the student's internal MongoDB _id to find their linked reports
    async for report in reports_collection.find(
        {
            "student_id": student["_id"]
        }
    ).sort("_id", -1).limit(5):

        report["_id"] = str(report["_id"])
        report["student_id"] = str(report["student_id"])

        reports.append(report)

    prompt = f"""
You are NeuroBridge AI Copilot.

Your job is to help teachers.

Student Information

Name: {student.get("student_name")}
Age: {student.get("age")}
Grade: {student.get("grade")}
School: {student.get("school")}

Previous Reports

{reports}

Teacher Question

{data.question}

Answer professionally.

Give practical classroom advice.

If possible provide:

• Teaching strategy

• Communication strategy

• Activity suggestion

• Things to avoid

• Expected outcome

Keep the answer under 400 words.
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4
    )

    return {
        "answer": completion.choices[0].message.content
    }