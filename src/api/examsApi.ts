import api from "./axios";

export async function fetchExamsRequest() {
  const res = await api.get("/exams");
  return res.data;
}

export async function createExamRequest(exam: object) {
  const res = await api.post("/exams", exam);
  return res.data;
}

export async function updateExamRequest(id: string, exam: object) {
  const res = await api.put(`/exams/${id}`, exam);
  return res.data;
}

export async function deleteExamRequest(id: string) {
  const res = await api.delete(`/exams/${id}`);
  return res.data;
}
