import { createSlice } from "@reduxjs/toolkit";
import type { Notification } from "../../types/notification";

import {
  createNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "./notificationsThunks";

interface NotificationsState {
  items: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach((n) => (n.read = true));
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload);
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default notificationSlice.reducer;
