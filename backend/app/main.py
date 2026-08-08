from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.students import router as students_router
from app.api.auth import router as auth_router
from app.api.screening import router as screening_router
from app.api.communication import router as communication_router
from app.api.learning import router as learning_router
from app.api.copilot import router as copilot_router
from app.routes import reports

from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="NeuroBridge AI Backend"
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://neurobridge-ai.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(
    reports.router,
    prefix=settings.API_PREFIX
)

app.include_router(
    auth_router,
    prefix=settings.API_PREFIX
)

app.include_router(
    students_router,
    prefix=settings.API_PREFIX
)

app.include_router(
    communication_router,
    prefix=settings.API_PREFIX
)

app.include_router(
    screening_router,
    prefix=settings.API_PREFIX
)

app.include_router(
    learning_router,
    prefix=settings.API_PREFIX
)

app.include_router(
    copilot_router,
    prefix=settings.API_PREFIX
)


@app.get("/")
async def root():
    return {
        "project": settings.APP_NAME,
        "status": "Running"
    }


@app.get("/health")
async def health():
    return {
        "status": "Healthy"
    }