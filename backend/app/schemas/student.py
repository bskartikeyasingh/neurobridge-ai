from pydantic import BaseModel, Field
from typing import Optional


class StudentCreate(BaseModel):

    student_name: str = Field(..., min_length=2)

    student_id: str = Field(..., min_length=3)

    password: str = Field(..., min_length=4)

    age: int = Field(..., ge=3, le=25)

    grade: str

    school: str

    gender: Optional[str] = None


class StudentUpdate(BaseModel):

    student_name: Optional[str] = None

    student_id: Optional[str] = None

    password: Optional[str] = None

    age: Optional[int] = None

    grade: Optional[str] = None

    school: Optional[str] = None

    gender: Optional[str] = None


class StudentResponse(BaseModel):

    id: str

    student_name: str

    student_id: str

    age: int

    grade: str

    school: str

    gender: Optional[str]