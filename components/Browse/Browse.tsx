import { SafeAreaView, View, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Nav } from '../Nav';
import { Buttons } from '../MainPage/Buttons';
import { BrowseBirthday } from './BrowseBirthday';
import moment from 'moment';
import { StatusBar } from 'expo-status-bar';

export const Browse = () => {
  const theme = useColorScheme() === 'dark';
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(moment());

  useEffect(() => {
    const updateTime = () => {
      const now = moment(); // Use moment to get the current time
      const formattedTime = now.format('HH:mm'); // Format time as HH:MM
      setCurrentTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <SafeAreaView
      style={{
        width: '100%',
        minHeight: '100%',
        paddingHorizontal: 15,
        backgroundColor: theme ? '#000' : '#fff',
      }}
    >
      
      <Nav
        topLeft={'Upcoming'}
        bottomLeft={currentDate.format('MMMM')} // Get current month name
        topRight={currentTime}
        bottomRight={currentDate.year().toString()} // Get current year
      />
      <Buttons />
      <BrowseBirthday currentDate={currentDate} setCurrentDate={setCurrentDate} />
    </SafeAreaView>
  );
};
