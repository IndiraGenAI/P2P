export interface IAppNotification {
  image: string;
  title: string;
  time: string;
  icon: string;
}

export interface IAppNotificationItemProps {
  notification: IAppNotification;
}
