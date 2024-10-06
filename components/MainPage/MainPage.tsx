import { View, Text, ScrollView, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Calendar } from './Calendar';
import { Nav } from '../Nav';
import { Birthdays } from './Birthdays';
import { Buttons } from './Buttons';
import { getBirthdays } from '../../utils/AsyncStorage';
import { Birthday } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentMonth } from '../../utils/Misc';
import { useIsFocused } from '@react-navigation/native';

export const MainPage = () => {
  const theme = useColorScheme() === 'dark';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      setBirthdays(data);
    })();
  }, [isFocused]);
  const countBirthdaysInCurrentMonth = (birthdays: Birthday[]) => {
    const currentMonth = new Date().getMonth(); // Get current month (0-11)
    return birthdays.filter((birthday) => {
      const birthdayDate = new Date(birthday.date); // Assuming birthday.date is a Date object or ISO string
      return birthdayDate.getMonth() === currentMonth;
    }).length;
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme ? '#000' : '#fff',
      }}
    >
      <ScrollView>
        <Nav
          topLeft={'Upcomming'}
          bottomLeft={getCurrentMonth()}
          topRight={'Budget'}
          bottomRight={
            '$' +
            String(
              birthdays.reduce((accumulator, current: Birthday) => {
                return accumulator + current.budget;
              }, 0)
            )
          }
          num={countBirthdaysInCurrentMonth(birthdays)}
        />
        <Buttons />
        <Birthdays />
        <Calendar />
      </ScrollView>
    </SafeAreaView>
  );
};
