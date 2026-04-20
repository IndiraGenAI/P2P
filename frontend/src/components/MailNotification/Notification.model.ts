export interface INotification {
  id: number;
  image: string;
  name: string;
  time: string;
  message: string;
  badge?: number;
}

export interface INotificationItemProps {
  notification: INotification;
}
