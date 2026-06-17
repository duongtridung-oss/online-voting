import motor.motor_asyncio
from beanie import init_beanie
from pydantic_settings import BaseSettings, SettingsConfigDict
from models import User, Poll, Vote, Notification, ActivityLog, SystemSettings, Candidate

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017/votecast_db"
    SECRET_KEY: str = "your-super-secret-jwt-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client.votecast_db, 
        document_models=[User, Poll, Vote, Notification, ActivityLog, SystemSettings, Candidate]
    )
    print("MongoDB Database initialized successfully")
