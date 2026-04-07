import type { AddEntryPayload, CalorieLog } from "../types/calorie";
import api from "./axios";

export const caloriesApi = {
  // GET /calories?date=2026-03-15
  getDay: async (date: string): Promise<CalorieLog | null> => {
    const { data } = await api.get("/calories", {
      params: { date },
    });
    return data;
  },

  // GET /calorie/history
  getHistory: async (): Promise<CalorieLog[]> => {
    const { data } = await api.get("/calories/history");
    return data;
  },
  // POST /calorie - add one entry
  addEntry: async (payload: AddEntryPayload): Promise<CalorieLog> => {
    const { data } = await api.post("/calories", payload);
    return data;
  },

  //PATCH /calories/:date/goal - update daily goal
  updateGoal: async (date: string, dailyGoal: number): Promise<CalorieLog> => {
    const { data } = await api.patch(`/calories/${date}/goal`, { dailyGoal });
    return data;
  },

  // DELETE /calorie/:date/melas/:mealType/entries/:entryId
  deleteEntry: async (
    date: string,
    mealType: string,
    entryId: string,
  ): Promise<CalorieLog> => {
    const { data } = await api.delete(
      `/calories/${date}/meals/${mealType}/entries/${entryId}`,
    );
    return data;
  },
};
