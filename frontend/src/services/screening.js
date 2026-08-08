import API from "./api";

export async function analyzeScreening(studentId, observations) {
  const response = await API.post("/screening/analyze", {
    student_id: studentId,
    observations,
  });

  return response.data;
}