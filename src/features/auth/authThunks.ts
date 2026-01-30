import type { AppDispatch } from "../../app/store";
import { loginError, loginStart, loginSuccess } from "./authSlice";

export const loginMock =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());

    setTimeout(() => {
      if (email && password) {
        dispatch(loginSuccess({ id: "1", email, name: "MediTrack User" }));
      } else {
        dispatch(loginError("Invalid credentials"));
      }
    }, 1000);
  };
