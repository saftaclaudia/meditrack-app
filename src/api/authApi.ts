// src/api/authApi.ts
import type { AuthResponse } from "../features/auth/authTypes";
import api from "./axios";

export const registerRequest = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const loginRequest = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", { email, password });
  console.log("ANXIOS LOGIN RESPONSE:", response);
  return response.data;
  console.log("LOGIN RESPONSE DATA:", response.data);
};

export const changePasswordRequest = async (
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> => {
  const response = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
