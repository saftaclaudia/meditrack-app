import anxios from "axios";

const BASE_URL = "http://localhost:5001/exams";

//helper get token from storage
function getToken(): string | null {
  return (
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    null
  );
}
// helper - get headers with token
function authHeaders() {
  const token = getToken();
  console.log("TOKEN TRIMIS:", token);
  return { headers: { Authorization: `Bearer ${getToken()}` } };
}

export async function featchExamsRequest() {
  const res = await anxios.get(BASE_URL, authHeaders());
  return res.data;
}
export async function createExamRequest(exam: object) {
  const res = await anxios.post(BASE_URL, exam, authHeaders());
  return res.data;
}
export async function updateExamRequest(id: string, exam: object) {
  const res = await anxios.put(`${BASE_URL}/${id}`, exam, authHeaders());
  return res.data;
}
export async function deleteExamRequest(id: string) {
  const res = await anxios.delete(`${BASE_URL}/${id}`, authHeaders());
  return res.data;
}
