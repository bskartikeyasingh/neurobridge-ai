from app.services.groq_service import ask_groq


async def chat_with_ai(message: str):

    reply = await ask_groq(message)

    return reply