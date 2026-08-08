from pydantic import BaseModel


class CommunicationRequest(BaseModel):

    speech_text: str


class CommunicationResponse(BaseModel):

    original_text: str

    simplified_text: str

    ai_response: str

    emotion: str



class ChatRequest(BaseModel):
    student_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str