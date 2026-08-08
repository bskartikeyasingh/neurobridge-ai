import API from "./api";

export async function getReports() {
  const res = await API.get("/reports/");
  return res.data;
}

export async function getReport(id) {
  const res = await API.get(`/reports/${id}`);
  return res.data;
}

export async function downloadReport(id) {
  const response = await API.get(
    `/reports/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
}