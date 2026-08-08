from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq

from app.core.config import settings

router = APIRouter(
    prefix="/learning",
    tags=["Learning"]
)

client = Groq(api_key=settings.GROQ_API_KEY)


class LearningRequest(BaseModel):
    chapter: str
    content: str


@router.post("/simplify")
async def simplify_lesson(data: LearningRequest):

    prompt = f"""
You are an expert teacher for neurodivergent students.

Your job is to explain lessons in very simple language.

Rules:

- Use short sentences.
- Use easy English.
- Give one real-life example.
- Keep the explanation engaging.
- End with 3 quick revision points.

Chapter:
{data.chapter}

Lesson:

{data.content}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return {
        "lesson": completion.choices[0].message.content
    }
class DoubtRequest(BaseModel):
    chapter: str
    question: str


@router.post("/doubt")
async def ask_doubt(data: DoubtRequest):

    prompt = f"""
You are a friendly AI teacher helping neurodivergent students.

Chapter:
{data.chapter}

Student Question:
{data.question}

Answer in very simple English.

Use short sentences.

Give one real-life example.

Keep the answer under 150 words.
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "answer": completion.choices[0].message.content
    }