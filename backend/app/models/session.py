from pydantic import Field
from datetime import datetime

from bson import ObjectId

from app.models.base import MongoBaseModel, PyObjectId


class Session(MongoBaseModel):

    id: Optional[PyObjectId] = Field(default_factory=ObjectId, alias="_id")

    student_id: PyObjectId

    speech_text: str

    simplified_text: str

    emotion: str

    ai_response: str

    created_at: datetime = Field(default_factory=datetime.utcnow)