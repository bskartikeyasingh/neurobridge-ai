from fastapi import Header, HTTPException
from jose import jwt, JWTError

from app.core.config import settings


def get_current_user(authorization: str = Header(...)):

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization Header"
        )

    token = authorization.split(" ")[1]

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )