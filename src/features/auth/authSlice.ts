import { createSlice } from "@reduxjs/toolkit";
import type { User } from "./authTypes";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const saveUser = localStorage.getItem("auth_user");

const initialState: AuthState = {
  user: saveUser ? JSON.parse(saveUser) : null,
  isAuthenticated: Boolean(saveUser),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("auth_user", JSON.stringify(action.payload));
    },
    loginError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("auth_user");
    },
  },
});
export const { loginStart, loginSuccess, loginError, logout } =
  authSlice.actions;
export default authSlice.reducer;
