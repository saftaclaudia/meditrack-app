import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Language } from "../../types/language";
import { loadLanguage } from "../../utils/languageStorage";

export type Theme = "light" | "dark";

export interface NotificationPrefs {
  exams: boolean;
  calories: boolean;
}

interface SettingsState {
  language: Language;
  theme: Theme;
  avatarColor: string;
  notificationPrefs: NotificationPrefs;
}

const saveTheme = localStorage.getItem("theme");
const savedAvatarColor = localStorage.getItem("avatarColor") ?? "#00AEBB";
const savedNotifPrefs = localStorage.getItem("notificationPrefs");

const initialState: SettingsState = {
  language: loadLanguage() ?? "en",
  theme: saveTheme === "dark" ? "dark" : "light",
  avatarColor: savedAvatarColor,
  notificationPrefs: savedNotifPrefs
    ? (JSON.parse(savedNotifPrefs) as NotificationPrefs)
    : { exams: true, calories: true },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setAvatarColor(state, action: PayloadAction<string>) {
      state.avatarColor = action.payload;
      localStorage.setItem("avatarColor", action.payload);
    },
    setNotificationPref(
      state,
      action: PayloadAction<{ key: keyof NotificationPrefs; value: boolean }>,
    ) {
      state.notificationPrefs[action.payload.key] = action.payload.value;
      localStorage.setItem(
        "notificationPrefs",
        JSON.stringify(state.notificationPrefs),
      );
    },
  },
});

export const { setLanguage, toggleTheme, setAvatarColor, setNotificationPref } =
  settingsSlice.actions;

export default settingsSlice.reducer;
