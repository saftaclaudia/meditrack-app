// src/features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginRequest,
  registerRequest,
  changePasswordRequest,
  deleteAccountRequest,
  googleAuthRequest,
} from "../../api/authApi";
import type { AuthResponse, RegisterResponse } from "./authTypes";
import type { AxiosError } from "axios";

const getErrorMessage = (err: unknown) => {
  if ((err as AxiosError).isAxiosError) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return axiosErr.response?.data?.message || axiosErr.message;
  }
  if (err instanceof Error) return err.message;
  return "Server error";
};

// REGISTER — no longer auto-logs in; backend now sends verification email
export const registerUser = createAsyncThunk<
  RegisterResponse,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    return await registerRequest(userData.name, userData.email, userData.password);
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// LOGIN with rememberMe — controls both token expiry (backend) and storage (frontend)
export const loginUser = createAsyncThunk<
  AuthResponse & { rememberMe: boolean },
  { email: string; password: string; rememberMe: boolean },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    const data = await loginRequest(email, password, rememberMe);
    return { ...data, rememberMe };
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// GOOGLE AUTH
export const loginWithGoogle = createAsyncThunk<
  AuthResponse,
  { credential: string },
  { rejectValue: string }
>("auth/loginWithGoogle", async ({ credential }, { rejectWithValue }) => {
  try {
    return await googleAuthRequest(credential);
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// CHANGE PASSWORD
export const changePasswordThunk = createAsyncThunk<
  { message: string },
  { currentPassword: string; newPassword: string },
  { rejectValue: string }
>("auth/changePassword", async ({ currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    return await changePasswordRequest(currentPassword, newPassword);
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// DELETE ACCOUNT
export const deleteAccountThunk = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>("auth/deleteAccount", async (_, { rejectWithValue }) => {
  try {
    return await deleteAccountRequest();
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});
