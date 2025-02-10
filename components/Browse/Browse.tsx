import { SafeAreaView, View, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Nav } from '../Nav';
import { Buttons } from '../MainPage/Buttons';
import { BrowseBirthday } from './BrowseBirthday';
import moment from 'moment';

export const Browse = () => {
  const theme = useColorScheme() === 'dark';
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(moment());

  useEffect(() => {
    const updateTime = () => {
      const now = moment();
      const formattedTime = now.format('HH:mm');
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
        bottomLeft={currentDate.format('MMMM')}
        topRight={currentTime}
        bottomRight={currentDate.year().toString()}
      />
      <Buttons />
      <BrowseBirthday currentDate={currentDate} setCurrentDate={setCurrentDate} />
    </SafeAreaView>
  );
};
