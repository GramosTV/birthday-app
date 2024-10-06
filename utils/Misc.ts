import { getBirthdays, saveBirthday } from "./AsyncStorage";
import * as Notifications from 'expo-notifications';
export const getCurrentMonth = (): string => {
    return new Date().toLocaleDateString('default', { month: 'long' });
};

interface SecondsProps {
    day: number;
    month: number;
    hour: number;
    minute: number;
}
export const getSecondsUntilDate = ({ day, month, hour, minute }: SecondsProps ) => {
    const now = new Date();
    let date = new Date(now.getFullYear(), month - 1, day, hour, minute, 0);
    let diff = date.getTime() - now.getTime();
    //console.log("seconds untill", diff / 1000);
    if (diff > 0) {
      return Math.floor(diff / 1000);
    } else {
      date = new Date(now.getFullYear() + 1, month, day, hour, minute);
      diff = date.getTime() - now.getTime();
      return Math.floor(diff / 1000);
    }
  };

  export const notifCheck = async () => {
    try {
      const birthdays = await getBirthdays();
      const now = new Date();
      for (let birthday of birthdays) {
        const birthdayDate = new Date(birthday.date);
        birthdayDate.setFullYear(now.getFullYear());
        if (birthday.notificationId) {
          try {
            const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
            const existingNotification = scheduledNotifications.find((n) => n.identifier === birthday.notificationId);
            if (existingNotification) {
              continue;
            }
          } catch (error) {
            console.error('Error checking notification:', error);
          }
        }
  
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `🎉 Happy Birthday, ${birthday.name}!`,
            body: `Don't forget to wish ${birthday.name} ${birthday.surname} a happy birthday!`,
            data: { birthdayId: birthday.id },
          },
          trigger: {
            seconds: getSecondsUntilDate({
              day: birthdayDate.getDate(),
              month: birthdayDate.getMonth() + 1,
              hour: 9,
              minute: 0,
            }),
            repeats: false,
          },
        });
        birthday.notificationId = notificationId;
        await saveBirthday(birthday);
      }
    } catch (error) {
      console.error('Error scheduling birthday notifications:', error);
    }
  }