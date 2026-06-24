import api from "./axios";

export const waterApi = {
  get: (date: string) =>
    api.get<{ glasses: number }>("/water", { params: { date } }).then((r) => r.data),
  set: (date: string, glasses: number) =>
    api.put<{ glasses: number }>("/water", { date, glasses }).then((r) => r.data),
};
