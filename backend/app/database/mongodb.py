from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URI)

database = client[settings.DATABASE_NAME]

users_collection = database["users"]

students_collection = database["students"]

reports_collection = database["reports"]

sessions_collection = database["sessions"]

analytics_collection = database["analytics"]