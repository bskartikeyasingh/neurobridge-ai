from fastapi import APIRouter, Depends

from app.schemas.auth import (
    GoogleLoginRequest,
    StudentLoginRequest,
    TokenResponse
)

from app.services.auth_service import login_with_google
from app.services.student_auth_service import login_student

from app.core.oauth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/login",
    response_model=TokenResponse
)
async def google_login(
    request: GoogleLoginRequest
):
    return await login_with_google(
        request.id_token,
        request.role
    )

@router.post("/student-login")
async def student_login(
    request: StudentLoginRequest
):
    return await login_student(
        request.student_id,
        request.password
    )

@router.get("/me")
async def current_user(
    user=Depends(get_current_user)
):
    return user