from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.schemas.student import StudentUpdate
from app.database.mongodb import students_collection
from app.schemas.student import StudentCreate
from passlib.context import CryptContext
from hashlib import sha256

router = APIRouter(prefix="/students", tags=["Students"])

# Setup password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

@router.post("/")
async def create_student(student: StudentCreate):
    student_dict = student.model_dump()
    
    # Hash password using sha256
    student_dict["password"] = sha256(
        student.password.encode()
    ).hexdigest()
    
    # Prevent duplicate Student IDs
    existing = await students_collection.find_one(
        {"student_id": student_dict["student_id"]}
    )
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Student ID already exists"
        )

    result = await students_collection.insert_one(student_dict)

    student_dict["_id"] = str(result.inserted_id)
    
    # Remove the password hash before sending the response back
    student_dict.pop("password", None)

    return {
        "message": "Student created successfully",
        "student": student_dict
    }

@router.get("/")
async def get_students():
    students = []
    
    async for student in students_collection.find():
        student["_id"] = str(student["_id"])
        # Optionally, ensure passwords never leak in the list view either
        student.pop("password", None)
        students.append(student)

    return students

@router.get("/stats/count")
async def student_count():
    count = await students_collection.count_documents({})
    return {
        "students": count
    }

@router.get("/{student_id}")
async def get_student(student_id: str):
    student = await students_collection.find_one(
        {"_id": ObjectId(student_id)}
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    student["_id"] = str(student["_id"])
    student.pop("password", None)

    return student

@router.put("/{student_id}")
async def update_student(student_id: str, student: StudentUpdate):
    await students_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": student.model_dump(exclude_unset=True)}
    )

    return {"message": "Student updated"}

@router.delete("/{student_id}")
async def delete_student(student_id: str):
    await students_collection.delete_one(
        {"_id": ObjectId(student_id)}
    )

    return {
        "message": "Student deleted successfully"
    }