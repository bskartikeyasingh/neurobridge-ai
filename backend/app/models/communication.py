from pydantic import BaseModel


class CommunicationRequest(BaseModel):
    text: str