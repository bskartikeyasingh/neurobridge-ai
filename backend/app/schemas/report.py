from pydantic import BaseModel


class ReportCreate(BaseModel):
    student_id: str
    observations: str


class ReportResponse(BaseModel):
    id: str
    possible_condition: str
    risk_level: str
    confidence: float
    strengths: str
    recommendation: str