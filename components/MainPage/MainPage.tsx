import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { Calendar } from './Calendar';
import { Nav } from '../Nav';
import { Birthdays } from './Birthdays';
import { Buttons } from './Buttons';
import { getBirthdays } from '../../utils/AsyncStorage';
import { Birthday } from '../../types';

export const MainPage = () => {
  const theme = useColorScheme() === 'dark';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();
  const [currentDate, setCurrentDate] = useState(moment());
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      setBirthdays(data);
    })();
  }, [isFocused]);

  const countBirthdaysInCurrentMonth = (birthdays: Birthday[]) => {
    const currentMonth = currentDate.month();
    return birthdays.filter((birthday) => moment(birthday.date).month() === currentMonth).length;
  };

  const countBudgetInCurrentMonth = (birthdays: Birthday[]) => {
    return (
      '$' +
      birthdays.reduce((accumulator, current: Birthday) => {
        if (moment(current.date).month() === currentDate.month()) {
          return accumulator + current.budget;
        }
        return accumulator;
      }, 0)
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme ? '#000' : '#fff',
        position: 'relative',
      }}
    >
      <Nav
        topLeft="Upcoming"
        bottomLeft={currentDate.format('MMMM')}
        topRight="Budget"
        bottomRight={countBudgetInCurrentMonth(birthdays)}
        num={countBirthdaysInCurrentMonth(birthdays)}
      />
      <Buttons />
      <Birthdays currentDate={currentDate} />
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />
    </SafeAreaView>
  );
};
