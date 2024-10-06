import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Calendar } from './components/MainPage/Calendar';
import { useColorScheme } from 'react-native';
import { MainPage } from './components/MainPage/MainPage';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import { BirthdayPage } from './components/BirthdayPage/BirthdayPage';
import { Create } from './components/Create';
import { Browse } from './components/Browse/Browse';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { Edit } from './components/Edit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import { getBirthdays, saveBirthday } from './utils/AsyncStorage';
import * as TaskManager from 'expo-task-manager';
import { getSecondsUntilDate, notifCheck } from './utils/Misc';

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
TaskManager.defineTask('BIRTHDAY_NOTIFICATION_TASK', notifCheck);

const SCHEDULED_KEY = 'isBirthdayNotificationScheduled';
const scheduleBirthdayNotificationTask = async () => {
  const isScheduled = await AsyncStorage.getItem(SCHEDULED_KEY);
  if (isScheduled !== 'true') {
    await BackgroundFetch.registerTaskAsync('BIRTHDAY_NOTIFICATION_TASK', {
      minimumInterval: 60 * 60 * 24,
      stopOnTerminate: false,
      startOnBoot: true,
    });
    await AsyncStorage.setItem(SCHEDULED_KEY, 'true');
  }
};
export default function App() {
  const theme = useColorScheme() === 'dark';
  useEffect(() => {
    scheduleBirthdayNotificationTask();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} />
        <Stack.Screen name="BirthdayPage" component={BirthdayPage} options={{ headerShown: false }} />
        <Stack.Screen
          name="Create"
          component={Create}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
            animationDuration: 200,
          }}
        />
        <Stack.Screen name="Edit" component={Edit} options={{ headerShown: false }} />
        <Stack.Screen name="Browse" component={Browse} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
