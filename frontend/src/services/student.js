import API from "./api";

export const getStudentCount = async () => {
  const response = await API.get("/students/stats/count");
  return response.data.students;
};

export const getStudents = async () => {
  const response = await API.get("/students");
  return response.data;
};

export const getStudent = async (id) => {
  const response = await API.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (student) => {
  console.log("Sending:", student);

  try {
    const response = await API.post("/students", student);
    return response.data;
  } catch (err) {
    console.log("STATUS:", err.response?.status);
    console.log("BODY:", err.response?.data);
    throw err;
  }
};

export const updateStudent = async (id, student) => {
  const response = await API.put(`/students/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await API.delete(`/students/${id}`);
  return response.data;
};

// NEW
export const loginStudent = async (student_name, password) => {
  const response = await API.post("/students/login", {
    student_name,
    password,
  });

  return response.data;
};