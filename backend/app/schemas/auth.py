from pydantic import BaseModel, EmailStr

class GoogleLoginRequest(BaseModel):
    id_token: str
    role: str
class StudentLoginRequest(BaseModel):
    student_id: str
    password: str

class UserResponse(BaseModel):

    id: str

    name: str

    email: EmailStr

    picture: str | None = None

    role: str


class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"

    user: UserResponse