from datetime import datetime
from bson import ObjectId

from app.database.mongodb import users_collection
from app.core.firebase import verify_firebase_token
from app.core.security import create_access_token

async def login_with_google(id_token: str, role: str):
    """
    Verify Firebase token, create user if not exists,
    generate JWT and return user.
    """
    decoded = verify_firebase_token(id_token)

    firebase_uid = decoded["uid"]
    email = decoded.get("email")
    name = decoded.get("name")
    picture = decoded.get("picture", "")

    # Check if user already exists
    existing_user = await users_collection.find_one(
        {"google_id": firebase_uid}
    )

    if existing_user is None:
        user = {
            "google_id": firebase_uid,
            "name": name,
            "email": email,
            "picture": picture,
            "role": role,
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow()
        }

        result = await users_collection.insert_one(user)
        user["_id"] = result.inserted_id

    else:
        await users_collection.update_one(
            {"_id": existing_user["_id"]},
            {
                "$set": {
                    "last_login": datetime.utcnow(),
                    "role": role
                }
            }
        )

        existing_user["role"] = role
        existing_user["last_login"] = datetime.utcnow()
        
        # Assign existing_user to user so the variable exists for JWT creation
        user = existing_user

    # Generate JWT using the universally defined 'user' dictionary
    access_token = create_access_token(
        {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"]
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "picture": user.get("picture", ""),
            "role": user["role"]
        }
    }