from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str
    API_PREFIX: str

    MONGODB_URI: str
    DATABASE_NAME: str

    GEMINI_API_KEY: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GROQ_API_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()