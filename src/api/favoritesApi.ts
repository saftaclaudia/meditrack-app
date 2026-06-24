import api from "./axios";
import type { FavoriteFood, MacroGoals } from "../types/favorites";

export const favoritesApi = {
  getAll: () =>
    api.get<FavoriteFood[]>("/profile/favorites").then((r) => r.data),
  add: (food: FavoriteFood) =>
    api.post<FavoriteFood[]>("/profile/favorites", food).then((r) => r.data),
  remove: (name: string) =>
    api.delete<FavoriteFood[]>(`/profile/favorites/${encodeURIComponent(name)}`).then((r) => r.data),
  getMacroGoals: () =>
    api.get<MacroGoals>("/profile/macros").then((r) => r.data),
  updateMacroGoals: (goals: MacroGoals) =>
    api.patch<MacroGoals>("/profile/macros", goals).then((r) => r.data),
};
