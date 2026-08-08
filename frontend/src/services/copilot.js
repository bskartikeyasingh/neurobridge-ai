import API from "./api";

export async function askCopilot(question, studentId) {
  const response = await API.post("/copilot/ask", {
    question,
    student_id: studentId,
  });

  return response.data;
}