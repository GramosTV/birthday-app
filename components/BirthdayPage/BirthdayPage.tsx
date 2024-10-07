import { View, Text, ScrollView, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Birthday } from '../Birthday';
import { Nav } from '../Nav';
import { QuickNote } from './QuickNote';
import { getBirthdayById } from '../../utils/AsyncStorage';
import { Birthday as bd } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { isBirthdayToday } from '../../utils/Misc';
import ConfettiCannon from 'react-native-confetti-cannon';
export const BirthdayPage = ({ route }: any) => {
  const { birthdayId } = route.params;
  const [birthday, setBirthday] = useState<bd>();
  const theme = useColorScheme() === 'dark';
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const bd = await getBirthdayById(birthdayId);
      setBirthday(bd);
    })();
  }, [isFocused]);

  if (!birthday)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 15,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '100%',
          minHeight: '100%',
          backgroundColor: theme ? '#000' : '#fff',
        }}
      ></SafeAreaView>
    );

  const getDaysUntilBirthday = () => {
    if (!birthday) return null;
    const today = new Date();
    const birthdayDate = new Date(birthday.date);
    birthdayDate.setFullYear(today.getFullYear());

    if (birthdayDate < today) {
      birthdayDate.setFullYear(today.getFullYear() + 1);
    }

    const timeDiff = birthdayDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysUntilBirthday = getDaysUntilBirthday();
  const birthdayAge = new Date().getFullYear() - new Date(birthday.date).getFullYear();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme ? '#000' : '#fff',
      }}
    >
      {isBirthdayToday(new Date(birthday.date)) ? (
        <ConfettiCannon count={350} origin={{ x: -10, y: 0 }} autoStartDelay={0} />
      ) : null}

      <ScrollView style={{ width: '100%' }}>
        <Nav
          topLeft={
            isBirthdayToday(new Date(birthday.date))
              ? `Happy Birthday ${birthday.name}!`
              : `${daysUntilBirthday} days until birthday`
          }
          bottomLeft={
            isBirthdayToday(new Date(birthday.date)) ? `Just turned ${birthdayAge}` : `Will turn ${birthdayAge}`
          }
          topRight={'Budget'}
          bottomRight={'$' + String(birthday?.budget)}
        />
        <Birthday birthday={birthday} />
        <QuickNote birthday={birthday} />
      </ScrollView>
    </SafeAreaView>
  );
};
