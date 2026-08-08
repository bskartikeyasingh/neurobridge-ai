from pydantic import BaseModel, ConfigDict
from bson import ObjectId
from typing import Any


class PyObjectId(ObjectId):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value: Any):

        if isinstance(value, ObjectId):
            return value

        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")

        return ObjectId(value)


class MongoBaseModel(BaseModel):

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_encoders={
            ObjectId: str
        }
    )