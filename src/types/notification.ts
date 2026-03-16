export type NotificationType =
  | "appointment"
  | "reminder"
  | "result"
  | "general";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  onRead: (id: string) => void;
}
