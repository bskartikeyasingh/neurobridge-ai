from pydantic import Field
from datetime import datetime
from typing import Optional
from bson import ObjectId

from app.models.base import MongoBaseModel, PyObjectId


class Report(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default_factory=ObjectId, alias="_id")

    student_id: PyObjectId

    observations: str

    possible_condition: str

    risk_level: str

    confidence: float

    strengths: str

    recommendation: str

    created_at: datetime = Field(default_factory=datetime.utcnow)