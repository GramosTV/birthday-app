import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Platform, StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { MaterialIcons } from '@expo/vector-icons';

import { MainPage } from './components/MainPage/MainPage';
import { BirthdayPage } from './components/BirthdayPage/BirthdayPage';
import { Create } from './components/Create';
import { Browse } from './components/Browse/Browse';
import { Edit } from './components/Edit';
import { Search } from './components/Search/Search';
import { Searcher } from './components/Searcher';
import { getBirthdays } from './utils/AsyncStorage';
import { notifCheck } from './utils/Misc';
import { Birthday } from './types';

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
    console.log('set channel');
    await Notifications.setNotificationChannelAsync('birthday-reminders', {
      name: 'Birthday Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
    await AsyncStorage.setItem('notificationChannelSet', 'true');
  }
};

TaskManager.defineTask('BIRTHDAY_NOTIFICATION_TASK', notifCheck);

const scheduleBirthdayNotificationTask = async () => {
  await BackgroundFetch.registerTaskAsync('BIRTHDAY_NOTIFICATION_TASK', {
    minimumInterval: 60 * 60 * 24,
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

export default function App() {
  const theme = useColorScheme() === 'dark';
  const [allBirthdays, setAllBirthdays] = useState<Birthday[]>([]);
  const [inputText, setInputText] = useState('');
  const [filteredBirthdays, setFilteredBirthdays] = useState<Birthday[]>([]);
  const [searchFlag, setSearchFlag] = useState<null | boolean | 0>(null);
  const [isInputVisible, setIsInputVisible] = useState(false);

  const inputWidth = useRef(new Animated.Value(0)).current;
  const inputPadding = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    (async () => {
      const birthdays = await getBirthdays();
      setAllBirthdays(birthdays);
    })();
  }, []);

  const toggleInput = () => {
    if (isInputVisible) {
      setSearchFlag(0);
      Animated.parallel([
        Animated.timing(inputWidth, {
          toValue: 0,
          duration: 230,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(inputPadding, {
          toValue: 0,
          duration: 230,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]).start(() => setIsInputVisible(false));
    } else {
      setIsInputVisible(true);
      setSearchFlag((prev) => !prev);
      Animated.parallel([
        Animated.timing(inputWidth, {
          toValue: 250,
          duration: 230,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(inputPadding, {
          toValue: 10,
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

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={theme ? '#000' : '#fff'} />
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} />
        <Stack.Screen name="BirthdayPage" component={BirthdayPage} options={{ headerShown: false }} />
        <Stack.Screen name="Create" component={Create} options={{ headerShown: false }} />
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
            onPress={toggleInput}
          >
            <MaterialIcons name="search" size={34} color="white" />
          </TouchableOpacity>
          {isInputVisible && (
            <Animated.View
              style={{
                width: inputWidth,
                height: '100%',
                borderRadius: 20,
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
