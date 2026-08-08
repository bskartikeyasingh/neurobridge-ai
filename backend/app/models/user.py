from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime

from bson import ObjectId

from app.models.base import MongoBaseModel, PyObjectId


class User(MongoBaseModel):

    id: Optional[PyObjectId] = Field(default_factory=ObjectId, alias="_id")

    google_id: str

    name: str

    email: EmailStr

    picture: Optional[str] = None

    role: str = "teacher"

    created_at: datetime = Field(default_factory=datetime.utcnow)

    last_login: datetime = Field(default_factory=datetime.utcnow)