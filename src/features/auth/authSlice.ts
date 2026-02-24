import { createSlice } from "@reduxjs/toolkit";
import type { User } from "./authTypes";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const savedUser =
  localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
const savedToken =
  localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
const savedExpiresAt =
  localStorage.getItem("auth_expires_at") ||
  sessionStorage.getItem("auth_expires_at");

let isAuthenticated = false;

if (savedUser && savedToken && savedExpiresAt) {
  const expiresAt = parseInt(savedExpiresAt);
  if (Date.now() < expiresAt) {
    isAuthenticated = true;
  } else {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_expires_at");
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_expires_at");
  }
}

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken ?? null,
  isAuthenticated,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    authError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      sessionStorage.removeItem("auth_token");
    },

    clearError(state) {
      state.error = null;
    },
  },
});
export const { authStart, authSuccess, authError, logout, clearError } =
  authSlice.actions;
export default authSlice.reducer;
