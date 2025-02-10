import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Birthday } from '../types';
import * as Notifications from 'expo-notifications';
import { notifCheck } from './Misc';

const moveBirthdayImage = async (imageUri: string): Promise<string> => {
  const filename = imageUri.split('/').pop();
  const newPath = `${FileSystem.documentDirectory}${filename}`;
  await FileSystem.moveAsync({
    from: imageUri,
    to: newPath,
  });
  return newPath;
};

export const saveBirthday = async (birthday: Birthday, notifChecking = false) => {
  try {
    const storedBirthdays = await AsyncStorage.getItem('birthdays');
    const currentBirthdays: Birthday[] = storedBirthdays ? JSON.parse(storedBirthdays) : [];
    const existingIndex = currentBirthdays.findIndex((b) => b.id === birthday.id);

    if (existingIndex !== -1) {
      const existingBirthday = currentBirthdays[existingIndex];
      if (existingBirthday.image !== birthday.image) {
        await FileSystem.deleteAsync(existingBirthday.image);
        birthday.image = await moveBirthdayImage(birthday.image);
      }
      currentBirthdays[existingIndex] = birthday;
    } else {
      birthday.image = await moveBirthdayImage(birthday.image);
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

    if (!notifChecking) {
      await notifCheck();
    }
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

export const getBirthdayById = async (id: string): Promise<Birthday | null> => {
  try {
    const storedBirthdays = await AsyncStorage.getItem('birthdays');
    const birthdays = storedBirthdays ? JSON.parse(storedBirthdays) : [];
    return birthdays.find((b: Birthday) => b.id === id) || null;
  } catch (error) {
    console.error('Error retrieving birthday by id:', error);
    return null;
  }
};

export const deleteBirthday = async (id: string) => {
  try {
    const storedBirthdays = await AsyncStorage.getItem('birthdays');
    const birthdays = storedBirthdays ? JSON.parse(storedBirthdays) : [];
    const birthdayToDelete = birthdays.find((b: Birthday) => b.id === id);

    if (birthdayToDelete?.notificationId) {
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

    const updatedBirthdays = birthdays.filter((b: Birthday) => b.id !== id);
    await AsyncStorage.setItem('birthdays', JSON.stringify(updatedBirthdays));
    console.log('Birthday deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting birthday and its notification:', error);
  }
};

export const deleteAllBirthdays = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
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
