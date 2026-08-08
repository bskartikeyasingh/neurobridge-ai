from pydantic import Field
from typing import Optional
from datetime import datetime

from bson import ObjectId

from app.models.base import MongoBaseModel, PyObjectId


class Student(MongoBaseModel):

    id: Optional[PyObjectId] = Field(
        default_factory=ObjectId,
        alias="_id"
    )

    teacher_id: PyObjectId

    # Basic Information
    student_name: str
    age: int
    grade: str
    school: str
    gender: Optional[str] = None

    # Parent Information
    parent_name: Optional[str] = None
    parent_email: Optional[str] = None
    parent_phone: Optional[str] = None

    # Academic Information
    section: Optional[str] = None
    roll_number: Optional[str] = None

    # AI Scores
    communication_score: float = 0.0
    attention_score: float = 0.0
    reading_score: float = 0.0
    emotion_score: float = 0.0

    # Risk Assessment
    risk_level: str = "Low"

    # Notes
    notes: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)