// src/api/authApi.ts
import type { AuthResponse, RegisterResponse } from "../features/auth/authTypes";
import api from "./axios";

export const registerRequest = async (
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const loginRequest = async (
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", { email, password, rememberMe });
  return response.data;
};

export const googleAuthRequest = async (credential: string): Promise<AuthResponse> => {
  const response = await api.post("/auth/google", { credential });
  return response.data;
};

export const verifyEmailRequest = async (token: string): Promise<{ message: string }> => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerificationRequest = async (email: string): Promise<{ message: string }> => {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
};

export const deleteAccountRequest = async (): Promise<{ message: string }> => {
  const response = await api.delete("/auth/delete-account");
  return response.data;
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

export const forgotPasswordRequest = async (
  email: string,
): Promise<{ message: string }> => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordRequest = async (
  token: string,
  password: string,
): Promise<{ message: string }> => {
  const response = await api.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};
