import type { Notification } from "../../types/notification";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchNotifications } from "./notificationsThunks";

interface notificationsState {
  items: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: notificationsState = {
  items: [],
  loading: false,
  error: null,
};

export const notificationsSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => (n.read = true));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch notification";
        state.loading = false;
      });
  },
});

export const { markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
