import api from "./axios";
import type { WeightEntry } from "../types/weight";

export const weightApi = {
  getHistory: () =>
    api.get<WeightEntry[]>("/weight").then((r) => r.data),
  log: (date: string, weight: number) =>
    api.put<WeightEntry>("/weight", { date, weight }).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/weight/${id}`).then((r) => r.data),
};
