import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/settingsSlice";
import examsReducer from "../features/exams/examsSlice";
import authReducer from "../features/auth/authSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

// Setup Redux
export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    exams: examsReducer,
    notifications: notificationsReducer,
  },
});

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
