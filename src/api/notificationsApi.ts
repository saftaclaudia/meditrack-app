import type { Notification } from "../types/notification";
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
  create: async (payload: {
    title: string;
    message: string;
    type?: string;
  }): Promise<Notification> => {
    const { data } = await api.post("/notifications", payload);
    return data;
  },
};
