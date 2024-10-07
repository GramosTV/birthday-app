import { View, Text, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Calendar } from './Calendar';
import { Nav } from '../Nav';
import { Birthdays } from './Birthdays';
import { Buttons } from './Buttons';
import { getBirthdays } from '../../utils/AsyncStorage';
import { Birthday } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentMonth } from '../../utils/Misc';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';

export const MainPage = () => {
  const theme = useColorScheme() === 'dark';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();
  const [currentDate, setCurrentDate] = useState(moment());
  const navigation: any = useNavigation();
  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      setBirthdays(data);
    })();
  }, [isFocused]);

  const countBirthdaysInCurrentMonth = (birthdays: Birthday[]) => {
    const currentMonth = currentDate.month(); // Get the current month using moment
    return birthdays.filter((birthday) => {
      const birthdayDate = moment(birthday.date); // Convert birthday.date to moment
      return birthdayDate.month() === currentMonth; // Compare the month
    }).length;
  };
  const countBudgetInCurrentMonth = (birthdays: Birthday[]) => {
    return (
      '$' +
      birthdays.reduce((accumulator, current: Birthday) => {
        const birthdayDate = moment(current.date); // Use moment to parse the date
        if (birthdayDate.month() === currentDate.month()) {
          // Check the month and year
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
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme ? '#000' : '#fff',
        position: 'relative',
      }}
    >
      <ScrollView>
        <Nav
          topLeft={'Upcoming'}
          bottomLeft={currentDate.format('MMMM')}
          topRight={'Budget'}
          bottomRight={countBudgetInCurrentMonth(birthdays)}
          num={countBirthdaysInCurrentMonth(birthdays)}
        />
        <Buttons />
        <Birthdays currentDate={currentDate} />
        <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </ScrollView>
      <TouchableOpacity
        style={{ position: 'absolute', bottom: 25, padding: 16, borderRadius: 20, backgroundColor: '#232323' }}
        onPress={() => navigation.navigate('Search')}
      >
        <MaterialIcons name="search" size={34} color={'white'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
