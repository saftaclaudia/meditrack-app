// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { registerUser, loginUser, changePasswordThunk, loginWithGoogle } from "./authThunks";
import type { AuthState, User } from "./authTypes";

function getInitialState(): AuthState {
  const now = Date.now();

  const lsToken = localStorage.getItem("auth_token");
  const lsExpiry = Number(localStorage.getItem("auth_expires_at") || 0);
  const lsValid = lsToken && lsExpiry > now;

  const ssToken = sessionStorage.getItem("auth_token");
  const ssExpiry = Number(sessionStorage.getItem("auth_expires_at") || 0);
  const ssValid = ssToken && ssExpiry > now;

  if (lsToken && !lsValid) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_expires_at");
  }

  if (ssToken && !ssValid) {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_expires_at");
  }

  const token = (lsValid && lsToken) || (ssValid && ssToken) || null;

  const user = JSON.parse(
    (lsValid && localStorage.getItem("auth_user")) ||
      (ssValid && sessionStorage.getItem("auth_user")) ||
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

function storeAuth(user: User, token: string, rememberMe: boolean) {
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const expiresAt = decoded.exp * 1000;
  const storage = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  storage.setItem("auth_user", JSON.stringify(user));
  storage.setItem("auth_token", token);
  storage.setItem("auth_expires_at", String(expiresAt));
  other.removeItem("auth_user");
  other.removeItem("auth_token");
  other.removeItem("auth_expires_at");
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout(state) {
      if (state.user) {
        localStorage.removeItem(`onboarding_seen_${state.user.id}`);
      }
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
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        const userJson = JSON.stringify(state.user);
        if (localStorage.getItem("auth_user")) {
          localStorage.setItem("auth_user", userJson);
        }
        if (sessionStorage.getItem("auth_user")) {
          sessionStorage.setItem("auth_user", userJson);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER — no auto-login anymore
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
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
        const { user, token, rememberMe } = action.payload;
        storeAuth(user, token, rememberMe);
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // GOOGLE LOGIN — always treated as "remember me"
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        storeAuth(user, token, true);
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google sign-in failed";
      })

      // CHANGE PASSWORD
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change password";
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
