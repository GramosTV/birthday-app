import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Birthday } from '../types';
import * as Notifications from 'expo-notifications';

export const saveBirthday = async (birthday: Birthday) => {
    try {
      const storedBirthdays = await AsyncStorage.getItem('birthdays');
      const currentBirthdays: Birthday[] = storedBirthdays ? JSON.parse(storedBirthdays) : [];
      const existingBirthdayIndex = currentBirthdays.findIndex((b: Birthday) => b.id === birthday.id);
  
      if (existingBirthdayIndex !== -1) {
        const existingBirthday = currentBirthdays[existingBirthdayIndex];
        if (existingBirthday.image !== birthday.image) {
          await FileSystem.deleteAsync(existingBirthday.image);
          const imageUri = birthday.image;
          const filename = imageUri.split('/').pop();
          const newPath = `${FileSystem.documentDirectory}${filename}`;
          await FileSystem.moveAsync({
            from: imageUri,
            to: newPath,
          });
          birthday.image = newPath;
        }
        currentBirthdays[existingBirthdayIndex] = birthday;
      } else {
        const imageUri = birthday.image;
        const filename = imageUri.split('/').pop();
        const newPath = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.moveAsync({
          from: imageUri,
          to: newPath,
        });
        birthday.image = newPath;
        // const notificationId = await scheduleBirthdayNotification(birthday);
        // birthday.notificationId = notificationId;
        currentBirthdays.push(birthday);
      }
      currentBirthdays.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getMonth() !== dateB.getMonth()) {
          return dateA.getMonth() - dateB.getMonth();
        }
        return dateA.getDate() - dateB.getDate();
      });
      await AsyncStorage.setItem('birthdays', JSON.stringify(currentBirthdays));
    } catch (error) {
      console.error('Error saving birthday:', error);
    }
  };
  

export const getBirthdays = async (): Promise<Birthday[]> => {
    try {
      const storedBirthdays = await AsyncStorage.getItem('birthdays');
      return storedBirthdays ? JSON.parse(storedBirthdays) : [];
    } catch (error) {
      console.error('Error retrieving birthdays:', error);
      return [];
    }
  };

  export const getBirthdayById = async (id: string) => {
    try {
      const storedBirthdays = await AsyncStorage.getItem('birthdays');
      const birthdays = storedBirthdays ? JSON.parse(storedBirthdays) : [];
      const birthday = birthdays.find((birthday: Birthday) => birthday.id === id);
      return birthday || null;
    } catch (error) {
      console.error('Error retrieving birthday by id:', error);
      return null;
    }
  };
  
  export const deleteBirthday = async (id: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem('birthdays');
      const birthdays = jsonValue != null ? JSON.parse(jsonValue) : [];
      const birthdayToDelete = birthdays.find((birthday: Birthday) => birthday.id === id);
      
      if (birthdayToDelete && birthdayToDelete.notificationId) {
        try {
          const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
          
          const notificationExists = scheduledNotifications.some(
            (notification) => notification.identifier === birthdayToDelete.notificationId
          );
  
          if (notificationExists) {
            await Notifications.cancelScheduledNotificationAsync(birthdayToDelete.notificationId);
            console.log(`Notification for birthday ${id} canceled successfully.`);
          } else {
            console.log(`Notification for birthday ${id} does not exist or is already canceled.`);
          }
        } catch (error) {
          console.error('Error checking or canceling notification:', error);
        }
      }
  
      const updatedBirthdays = birthdays.filter((birthday: Birthday) => birthday.id !== id);
      await AsyncStorage.setItem('birthdays', JSON.stringify(updatedBirthdays));
      console.log('Birthday deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting birthday and its notification:', error);
    }
  };
  
  

  export const deleteAllBirthdays = async () => {
    try {
      await AsyncStorage.removeItem('birthdays');
      console.log('All birthdays deleted successfully.');
    } catch (error) {
      console.error('Error deleting all birthdays:', error);
    }
  };

  const scheduleBirthdayNotification = async (birthday: Birthday) => {
    const today = new Date();
    const birthdayDate = new Date(birthday.date);
    birthdayDate.setFullYear(today.getFullYear());
    if (birthdayDate < today) {
        birthdayDate.setFullYear(today.getFullYear() + 1);
    }
    return await Notifications.scheduleNotificationAsync({
        content: {
            title: `🎉 Happy Birthday, ${birthday.name}!`,
            body: `Don't forget to wish ${birthday.name} ${birthday.surname} a happy birthday!`,
            data: { birthdayId: birthday.id },
        },
        trigger: {
            year: birthdayDate.getFullYear(),
            month: birthdayDate.getMonth() + 1,
            day: birthdayDate.getDate(),
            hour: 9, 
            minute: 0,
            repeats: true,
        },
    });
};

