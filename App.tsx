import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from './components/MainPage/Calendar';
import { useColorScheme, Text } from 'react-native';
import { MainPage } from './components/MainPage/MainPage';
import * as Font from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { BirthdayPage } from './components/BirthdayPage/BirthdayPage';
import { Create } from './components/Create';
import { Browse } from './components/Browse/Browse';
import { NavigationContainer, useIsFocused, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { Edit } from './components/Edit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import { deleteAllBirthdays, getBirthdays, saveBirthday } from './utils/AsyncStorage';
import * as TaskManager from 'expo-task-manager';
import { exportBirthdays, getSecondsUntilDate, notifCheck } from './utils/Misc';
import { MaterialIcons } from '@expo/vector-icons';
import { Search } from './components/Search/Search';
import { Birthday } from './types';
import { Searcher } from './components/Searcher';

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    // const channelSet = await AsyncStorage.getItem('notificationChannelSet');
    // if (channelSet !== 'true') {
    console.log('set channel');
    await Notifications.setNotificationChannelAsync('birthday-reminders', {
      name: 'Birthday Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default', // Can be customized
      vibrationPattern: [0, 250, 250, 250], // Optional vibration pattern
      // lightColor: '#FF231F7C', // Optional LED light color
    });
    await AsyncStorage.setItem('notificationChannelSet', 'true');
  }
  // }
};

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
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
      await setupNotificationChannel();
      await scheduleBirthdayNotificationTask();
    })();
  }, []);
  const [allBirthdays, setAllBirthdays] = useState<Birthday[]>([]);

  // const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const birthdays = await getBirthdays();
      setAllBirthdays(birthdays);
    })();

    // setTimeout(() => toggleInput(), 250);
  }, []);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const inputWidth = useRef(new Animated.Value(0)).current; // Initial width is 0
  // const navigation = useNavigation();
  const inputPadding = useRef(new Animated.Value(0)).current; // Initial paddingHorizontal is 0
  const [inputText, setInputText] = useState('');
  const [filteredBirthdays, setFilteredBirthdays] = useState<Birthday[]>([]);
  const [searchFlag, setSearchFlag] = useState<null | boolean | 0>(null);
  const toggleInput = () => {
    if (isInputVisible) {
      setSearchFlag(0);
      // Animate the TextInput width and padding back to 0 when hiding it
      Animated.parallel([
        Animated.timing(inputWidth, {
          toValue: 0,
          duration: 230,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(inputPadding, {
          toValue: 0, // Reduce padding to 0
          duration: 230,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]).start(() => setIsInputVisible(false));
    } else {
      // Animate the TextInput width and padding when showing it
      setIsInputVisible(true);
      setSearchFlag((prev) => !prev);
      Animated.parallel([
        Animated.timing(inputWidth, {
          toValue: 250, // Target width
          duration: 230,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(inputPadding, {
          toValue: 10, // Target paddingHorizontal
          duration: 230,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]).start();
    }
  };
  const filterBirthdays = (text: string) => {
    setInputText(text);
    const filtered = allBirthdays.filter(
      (birthday) =>
        birthday.name.toLowerCase().includes(text.toLowerCase()) ||
        birthday.surname.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBirthdays(filtered);
  };
  const formatDate = (seconds: number) => {
    const date = new Date(Date.now() + seconds * 1000);
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const logActiveChannelsAndPendingNotifications = async () => {
    // await Notifications.cancelAllScheduledNotificationsAsync();
    if (Platform.OS === 'android') {
      // Log active notification channels
      const channels = await Notifications.getNotificationChannelsAsync();
      console.log('Active Notification Channels:', channels);
    } else {
      console.log('Notification channels are only available on Android.');
    }

    // Log all pending (scheduled) notifications
    const pendingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Pending Notifications:', pendingNotifications.length);

    // Format and log notifications
    pendingNotifications.forEach((notification) => {
      const id = notification.identifier; // Get the notification ID
      const title: any = notification.content.title;
      const name = title.replace('🎉 Happy Birthday, ', '').replace('!', '').trim(); // Extract the name
      const seconds = (notification.trigger as any).seconds; // Get the seconds for the trigger
      const dateOfNotif = formatDate(seconds); // Format the date
    
      console.log(`ID: ${id}, Name: ${name}, Date: ${dateOfNotif}`);
    });
  };

  const simulateBirthdayNotification = async (birthday: any) => {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `🎉 Happy Birthday, ${birthday.name}!`,
        body: `Don't forget to wish ${birthday.name} ${birthday.surname} a happy birthday!`,
        data: { birthdayId: birthday.id },
      },
      trigger: { seconds: 5 }, // Triggers notification in 5 seconds
    });
  };
  const unregisterTasks = async () => {
    await TaskManager.unregisterAllTasksAsync()
  }
  return (
    <NavigationContainer>
       <StatusBar style={theme ? 'dark' : 'light'}/>
      {/* <TouchableOpacity onPress={logActiveChannelsAndPendingNotifications}>
        <Text>Log</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteAllBirthdays}>
        <Text>Delete all</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => simulateBirthdayNotification({
    name: "John",
    surname: "Doe",
    id: "12345",
    date: "2024-11-09"
  })}>
    <Text>Test notif</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={notifCheck}>
    <Text>Notif check</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={unregisterTasks}>
      <Text>Unregister tasks</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => exportBirthdays(false)}>
    <Text>Export</Text>
    </TouchableOpacity> */}
      <Stack.Navigator initialRouteName="MainPage">
        
        <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} />
        <Stack.Screen name="BirthdayPage" component={BirthdayPage} options={{ headerShown: false }} />
        <Stack.Screen
          name="Create"
          component={Create}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'fade_from_bottom',
            animationDuration: 200,
          }}
          initialParams={{ filteredBirthdays, inputText, allBirthdays }}
        />
        <Stack.Screen name="Edit" component={Edit} options={{ headerShown: false }} />
        <Stack.Screen name="Browse" component={Browse} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Searcher
        filteredBirthdays={filteredBirthdays}
        inputText={inputText}
        allBirthdays={allBirthdays}
        searchFlag={searchFlag}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 25,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: Dimensions.get('window').width,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: theme ? '#333' : '#f0f0f0',
            borderRadius: 20,
            opacity: 0.6,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 16,
              borderRadius: 20,
              backgroundColor: '#232323',
            }}
            onPress={() => toggleInput()}
          >
            <MaterialIcons name="search" size={34} color={'white'} />
          </TouchableOpacity>

          {/* Animated TextInput */}
          {isInputVisible && (
            <Animated.View
              style={{
                width: inputWidth, // Animated width
                height: '100%',
                // backgroundColor: theme ? '#333' : '#f0f0f0',
                borderRadius: 20,
                // justifyContent: 'center',
                // alignItems: 'center',
                paddingVertical: 15,
                paddingHorizontal: inputPadding,
              }}
            >
              <TextInput
                style={{
                  color: theme ? '#fff' : '#000',
                  fontSize: 16,
                  width: '100%',
                }}
                placeholder="Search..."
                placeholderTextColor={theme ? '#aaa' : '#888'}
                value={inputText}
                onChangeText={filterBirthdays}
              />
            </Animated.View>
          )}
        </View>
      </View>
    </NavigationContainer>
  );
}
