// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "./authThunks";
import type { AuthState } from "./authTypes";

function getInitialState(): AuthState {
  const token =
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    null;

  const user = JSON.parse(
    localStorage.getItem("auth_user") ||
      sessionStorage.getItem("auth_user") ||
      "null",
  );

  return {
    user,
    token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_expires_at");
      sessionStorage.removeItem("auth_user");
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_expires_at");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
        localStorage.setItem("auth_token", action.payload.token);

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload;
        if (payload && payload.user && payload.token) {
          const decoded = JSON.parse(atob(payload.token.split(".")[1]));
          const expiresAt = decoded.exp * 1000;

          if (payload.rememberMe) {
            localStorage.setItem("auth_user", JSON.stringify(payload.user));
            localStorage.setItem("auth_token", payload.token);
            localStorage.setItem("auth_expires_at", String(expiresAt));
          } else {
            sessionStorage.setItem("auth_user", JSON.stringify(payload.user));
            sessionStorage.setItem("auth_token", payload.token);
            sessionStorage.setItem("auth_expires_at", String(expiresAt));
          }

          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          state.loading = false;
        } else {
          state.loading = false;
          state.error = "Login failed";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
