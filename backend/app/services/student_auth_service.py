from hashlib import sha256
from fastapi import HTTPException

from app.database.mongodb import students_collection
from app.core.security import create_access_token


async def login_student(student_id: str, password: str):

    student = await students_collection.find_one(
        {"student_id": student_id}
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    hashed = sha256(password.encode()).hexdigest()

    if hashed != student["password"]:
        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )

    token = create_access_token(
        {
            "user_id": str(student["_id"]),
            "role": "student"
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(student["_id"]),
            "name": student["student_name"],
            "student_id": student["student_id"],
            "role": "student"
        }
    }