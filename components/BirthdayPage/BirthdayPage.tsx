import React, { useEffect, useState } from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Birthday } from '../Birthday';
import { Nav } from '../Nav';
import { QuickNote } from './QuickNote';
import { getBirthdayById } from '../../utils/AsyncStorage';
import { isBirthdayToday } from '../../utils/Misc';
import { Birthday as bd } from '../../types';

export const BirthdayPage = ({ route }: any) => {
  const { birthdayId } = route.params;
  const [birthday, setBirthday] = useState<bd | null>(null);
  const theme = useColorScheme() === 'dark';
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const bd = await getBirthdayById(birthdayId);
      setBirthday(bd);
    })();
  }, [isFocused]);

  if (!birthday) {
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
      />
    );
  }

  const getDaysUntilBirthday = () => {
    if (!birthday) return null;
    const today = new Date();
    const birthdayDate = new Date(birthday.date);
    birthdayDate.setFullYear(today.getFullYear());

    if (birthdayDate < today) {
      birthdayDate.setFullYear(today.getFullYear() + 1);
    }

    const timeDiff = birthdayDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
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
      {isBirthdayToday(new Date(birthday.date)) && (
        <ConfettiCannon count={350} origin={{ x: -10, y: 0 }} autoStartDelay={0} />
      )}

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
          topRight="Budget"
          bottomRight={`$${birthday?.budget}`}
        />
        <Birthday birthday={birthday} />
        <QuickNote birthday={birthday} />
      </ScrollView>
    </SafeAreaView>
  );
};
