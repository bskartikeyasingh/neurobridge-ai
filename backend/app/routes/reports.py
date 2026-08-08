from bson import ObjectId
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.database.mongodb import reports_collection, students_collection
from app.utils.pdf_generator import generate_report_pdf

router = APIRouter(prefix="/reports", tags=["Reports"])


def serialize_report(report: dict) -> dict:
    """Helper to convert MongoDB ObjectIds to clean strings for JSON serialization."""
    if "_id" in report:
        report["_id"] = str(report["_id"])
    if "student_id" in report and isinstance(report["student_id"], ObjectId):
        report["student_id"] = str(report["student_id"])
    return report


@router.get("/")
async def get_reports():
    reports = []
    async for report in reports_collection.find().sort("_id", -1):
        # 1. Look up student using custom string ID (e.g. STD002)
        student = await students_collection.find_one(
            {"student_id": report.get("student_id")}
        )

        if student:
            report["student_name"] = student.get("student_name") or student.get("name", "Unknown Student")
            report["grade"] = student.get("grade", "")
        else:
            report["student_name"] = report.get("student_name", "Unknown Student")
            report["grade"] = ""

        # 2. Serialize ObjectIds so FastAPI can convert to JSON without 500 errors
        reports.append(serialize_report(report))

    return reports


@router.get("/{report_id}")
async def get_report(report_id: str):
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    report = await reports_collection.find_one({"_id": ObjectId(report_id)})

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    student = await students_collection.find_one(
        {"student_id": report.get("student_id")}
    )

    if student:
        report["student_name"] = student.get("student_name") or student.get("name", "Unknown Student")
        report["grade"] = student.get("grade", "")
    else:
        report["student_name"] = report.get("student_name", "Unknown Student")
        report["grade"] = ""

    return serialize_report(report)


@router.get("/student/{student_id}")
async def get_student_reports(student_id: str):
    reports = []
    # Query directly by custom string student_id
    async for report in reports_collection.find(
        {"student_id": student_id}
    ).sort("_id", -1):
        student = await students_collection.find_one(
            {"student_id": report.get("student_id")}
        )

        if student:
            report["student_name"] = student.get("student_name") or student.get("name", "Unknown Student")
            report["grade"] = student.get("grade", "")
        else:
            report["student_name"] = report.get("student_name", "Unknown Student")
            report["grade"] = ""

        reports.append(serialize_report(report))

    return reports


@router.delete("/{report_id}")
async def delete_report(report_id: str):
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    result = await reports_collection.delete_one({"_id": ObjectId(report_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")

    return {"message": "Report deleted successfully"}


@router.get("/{report_id}/download")
async def download_report(report_id: str):
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    report = await reports_collection.find_one({"_id": ObjectId(report_id)})

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    student = await students_collection.find_one(
        {"student_id": report.get("student_id")}
    )

    if student:
        report["student_name"] = student.get("student_name") or student.get("name", "Unknown Student")
        report["grade"] = student.get("grade", "")
    else:
        report["student_name"] = report.get("student_name", "Unknown Student")
        report["grade"] = ""

    report = serialize_report(report)
    
    try:
        # Pass the fully populated report dict to the generator
        pdf = generate_report_pdf(report)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

    # Format the filename dynamically to include the student's name
    safe_student_name = report.get("student_name", "Student").replace(" ", "_")
    filename = f"NeuroBridge_Report_{safe_student_name}.pdf"

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )