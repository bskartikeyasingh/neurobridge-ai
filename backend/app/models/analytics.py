from pydantic import Field
from typing import List
from datetime import datetime

from bson import ObjectId

from app.models.base import MongoBaseModel, PyObjectId


class Analytics(MongoBaseModel):

    id: Optional[PyObjectId] = Field(default_factory=ObjectId, alias="_id")

    student_id: PyObjectId

    emotion_history: List[str] = Field(default_factory=list)

    communication_progress: List[int] = Field(default_factory=list)

    reading_progress: List[int] = Field(default_factory=list)

    last_updated: datetime = Field(default_factory=datetime.utcnow)