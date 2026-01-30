import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Notification } from "../../types/notification";

export const fetchNotifications = createAsyncThunk<Notification[], void>(
  "notifications/fetch",
  async () => {
    const response = await new Promise<Notification[]>((resolve) => {
      setTimeout(
        () =>
          resolve([
            {
              id: "1",
              title: "New Exam Added",
              message: "You have a new exam scheduled for tomorrow",
              timestamp: new Date().toISOString(),
              read: true,
            },
            {
              id: "2",
              title: "Profile Update",
              message: "Your profile war updated successully",
              timestamp: new Date().toISOString(),
              read: false,
            },
          ]),
        1000,
      );
    });
    return response;
  },
);
