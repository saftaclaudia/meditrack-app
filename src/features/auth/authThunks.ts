// src/features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest, registerRequest } from "../../api/authApi";
import type { AuthResponse } from "./authTypes";
import type { AxiosError } from "axios";

// Helper pentru extragerea mesajului de eroare
const getErrorMessage = (err: unknown) => {
  if ((err as AxiosError).isAxiosError) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return axiosErr.response?.data?.message || axiosErr.message;
  }
  if (err instanceof Error) return err.message;
  return "Server error";
};

// REGISTER
export const registerUser = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const data = await registerRequest(
      userData.name,
      userData.email,
      userData.password,
    );
    return data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// LOGIN with rememberMe
export const loginUser = createAsyncThunk<
  AuthResponse & { rememberMe?: boolean },
  { email: string; password: string; rememberMe: boolean },
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const data = await loginRequest(email, password);

      return { ...data, rememberMe };
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
