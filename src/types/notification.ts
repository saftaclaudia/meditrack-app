export type NotificationType =
  | "appointment"
  | "reminder"
  | "result"
  | "general";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}
