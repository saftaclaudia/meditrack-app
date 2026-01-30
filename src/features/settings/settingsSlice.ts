import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Language } from "../../types/language";
import { loadLanguage } from "../../utils/languageStorage";

export type Theme = "light" | "dark";

interface SettingsState {
  language: Language;
  theme: Theme;
}
const saveTheme = localStorage.getItem("theme");

const initialState: SettingsState = {
  language: loadLanguage() ?? "en",
  theme: saveTheme === "dark" ? "dark" : "light",
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
  },
});
// action creator
export const { setLanguage, toggleTheme } = settingsSlice.actions;

// reducer function
export default settingsSlice.reducer;
