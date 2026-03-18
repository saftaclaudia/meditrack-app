// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001", // fără /api, pentru că backend-ul tău are rutele direct sub /auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
