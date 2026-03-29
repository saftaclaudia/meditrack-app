export interface NotificationDTO {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: "appointment" | "reminder" | "result" | "general";
}
