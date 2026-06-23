import type { Notification } from "../types/notification";
import type { NotificationPrefs } from "../features/settings/settingsSlice";
import api from "./axios";

export const notificationsApi = {
  fetchAll: async (): Promise<Notification[]> => {
    const { data } = await api.get("/notifications");
    return data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },

  deleteOne: async (id: string): Promise<{ id: string }> => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },

  clearAll: async (): Promise<void> => {
    await api.delete("/notifications");
  },

  create: async (payload: { title: string; message: string; type?: string }): Promise<Notification> => {
    const { data } = await api.post("/notifications", payload);
    return data;
  },

  getPrefs: async (): Promise<NotificationPrefs> => {
    const { data } = await api.get("/notifications/prefs");
    return data;
  },

  updatePrefs: async (prefs: NotificationPrefs): Promise<NotificationPrefs> => {
    const { data } = await api.patch("/notifications/prefs", prefs);
    return data;
  },
};
