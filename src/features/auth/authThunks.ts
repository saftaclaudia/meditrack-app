import type { AppDispatch } from "../../app/store";
import persistAuth from "../../utils/persistAuth";
import { authError, authStart, authSuccess } from "./authSlice";

export const loginMock =
  (email: string, password: string, rememberMe: boolean) =>
  async (dispatch: AppDispatch) => {
    dispatch(authStart());

    setTimeout(() => {
      if (email && password.length >= 6) {
        const authData = {
          user: { id: "1", email, name: "MediTrack User" },
          token: "mock-jwt-token-123",
        };

        persistAuth(authData, rememberMe);

        dispatch(authSuccess(authData));
      } else {
        dispatch(authError("Invalid credentials"));
      }
    }, 1000);
  };

export const registerMock =
  (name: string, email: string, password: string, rememberMe: boolean) =>
  async (dispatch: AppDispatch) => {
    dispatch(authStart());

    setTimeout(() => {
      if (!name || !email || password.length < 6) {
        dispatch(authError("Please fill in all fields correctly."));
        return;
      }

      const authData = {
        user: {
          id: crypto.randomUUID(),
          name,
          email,
        },
        token: "mock-jwt-token-" + Date.now(),
      };

      persistAuth(authData, rememberMe);

      dispatch(authSuccess(authData));
    }, 1000);
  };
