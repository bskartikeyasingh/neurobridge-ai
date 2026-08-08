import API from "./api";

export async function analyzeCommunication(studentId, text) {

    const response = await API.post("/communication/analyze", {
        student_id: studentId,
        text: text
    });

    return response.data;
}