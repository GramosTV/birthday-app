import JSZip from "jszip";
import { Birthday } from "../types";
import { getBirthdays, saveBirthday } from "./AsyncStorage";
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format } from "date-fns";

export const getCurrentMonth = (): string => {
  return new Date().toLocaleDateString('default', { month: 'long' });
};

interface SecondsProps {
  day: number;
  month: number;
  hour: number;
  minute: number;
}
export const getSecondsUntilDate = ({ day, month, hour, minute }: SecondsProps) => {
  const now = new Date();
  let date = new Date(now.getFullYear(), month - 1, day, hour, minute, 0);
  let diff = date.getTime() - now.getTime();

  if (diff > 0) {
    return Math.floor(diff / 1000);
  } else {
    date = new Date(now.getFullYear() + 1, month - 1, day, hour, minute, 0);
    diff = date.getTime() - now.getTime();
    return Math.floor(diff / 1000);
  }
};

export const notifCheck = async () => {
  console.log('run')
  try {
    const birthdays = await getBirthdays();
    const now = new Date();
    console.log(birthdays.length)
    for (let birthday of birthdays) {
      console.log('run2')
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
          channelId: 'birthday-reminders',
          repeats: false,
        },
      });

      birthday.notificationId = notificationId;
      await saveBirthday(birthday, true);
    }
  } catch (error) {
    console.error('Error scheduling birthday notifications:', error);
  }
}

export const isBirthdayToday = (birthDate: Date) => {
  const today = new Date();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  if (birthMonth === 1 && birthDay === 29) {
    if (isLeapYear(today.getFullYear())) {
      return todayMonth === 1 && todayDay === 29;
    } else {
      return todayMonth === 1 && todayDay === 28;
    }
  }

  return birthMonth === todayMonth && birthDay === todayDay;
};

const jsonToCsv = (json: any[]): string => {
  const header = Object.keys(json[0]).join(',');
  const rows = json.map((row) => Object.values(row).join(','));
  return [header, ...rows].join('\n');
};
export const exportBirthdays = async (exportAsJson: boolean) => {
  const birthdays = await getBirthdays();
  const zip = new JSZip();
  const jsonFileName = 'birthdays.json';
  const csvFileName = 'birthdays.csv';
  const zipFileName = `birthdays_and_images_${exportAsJson ? 'json' : 'csv'}.zip`;
  const imagesFolder = zip.folder('images');
  for (const birthday of birthdays) {
    if (birthday.image) {
      try {
        const base64Image = await readImageAsBase64(birthday.image);
        const imageName = `${birthday.name}_${birthday.surname}_${birthday.id}.jpg`;
        imagesFolder?.file(imageName, base64Image, { base64: true });
      } catch (error) {
        console.error('Error reading image for birthday', birthday.name, error);
      }
    }
  }
  const formattedBirthdays = birthdays.map((birthday: any) => {
    const { id, notificationId, ...formatted } = birthday;
    formatted.date = format(new Date(birthday.date), 'yyyy-MM-dd');
    formatted.image = `${birthday.name}_${birthday.surname}_${birthday.id}.jpg`;
    return formatted;
  });
  let fileContent: string;
  let fileName: string;
  if (exportAsJson) {
    fileContent = JSON.stringify(formattedBirthdays, null, 2);
    fileName = jsonFileName;
  } else {
    fileContent = jsonToCsv(formattedBirthdays);
    fileName = csvFileName;
  }
  zip.file(fileName, fileContent);
  const content: any = await zip.generateAsync({ type: 'base64' });
  const zipPath = FileSystem.documentDirectory + zipFileName;
  await FileSystem.writeAsStringAsync(zipPath, content, {
    encoding: FileSystem.EncodingType.Base64,
  });
  await Sharing.shareAsync(zipPath);
};
const readImageAsBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64Image;
  } catch (error) {
    throw new Error('Failed to read image as Base64: ' + error);
  }
};

export const onExport = async () => {
  const exportAsJson = true;
  await exportBirthdays(exportAsJson);
};