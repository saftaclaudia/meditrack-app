import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/settingsSlice";
import examsReducer from "../features/exams/examsSlice";
import authReducer from "../features/auth/authSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import caloriesReducer from "../features/calories/caloriesSlice";
import profileReducer from "../features/profile/profileSlice";
import recipesReducer from "../features/recipes/recipesSlice";
import activitiesReducer from "../features/calories/activitiesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    exams: examsReducer,
    notifications: notificationsReducer,
    calories: caloriesReducer,
    profile: profileReducer,
    recipes: recipesReducer,
    activities: activitiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
