import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/settingsSlice";
import examsReducer from "../features/exams/examsSlice";
import authReducer from "../features/auth/authSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import caloriesReducer from "../features/calories/caloriesSlice";
import profileReducer from "../features/profile/profileSlice";
import recipesReducer from "../features/recipes/recipesSlice";
import activitiesReducer from "../features/calories/activitiesSlice";
import waterReducer from "../features/calories/waterSlice";
import weightReducer from "../features/calories/weightSlice";
import mealTemplatesReducer from "../features/calories/mealTemplatesSlice";
import favoritesReducer from "../features/calories/favoritesSlice";

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
    water: waterReducer,
    weight: weightReducer,
    mealTemplates: mealTemplatesReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
