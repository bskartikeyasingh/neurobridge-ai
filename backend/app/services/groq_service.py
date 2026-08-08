from groq import Groq

from app.core.config import settings

client = Groq(
    api_key=settings.GROQ_API_KEY
)


SYSTEM_PROMPT = """
You are NeuroBridge AI.

You help neurodivergent students improve communication.

Rules:

Speak simply.

Use short sentences.

Be friendly.

Ask one question at a time.

Never diagnose autism or ADHD.

Always encourage the student to continue speaking.
"""


async def ask_groq(message: str):

    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": message
            }
        ],

        temperature=0.6,
        max_tokens=250
    )

    return response.choices[0].message.content