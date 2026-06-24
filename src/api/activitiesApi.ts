import api from "./axios";
import type { Activity, NewActivity } from "../types/activity";

export const activitiesApi = {
  getByDate: (date: string) =>
    api.get<Activity[]>("/activities", { params: { date } }).then((r) => r.data),

  add: (payload: NewActivity) =>
    api.post<Activity>("/activities", payload).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/activities/${id}`).then((r) => r.data),
};
