import { View, Text, ScrollView, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Birthday } from '../Birthday';
import { Nav } from '../Nav';
import { QuickNote } from './QuickNote';
import { getBirthdayById } from '../../utils/AsyncStorage';
import { Birthday as bd } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

export const BirthdayPage = ({ route }: any) => {
  const { birthdayId } = route.params;
  const [birthday, setBirthday] = useState<bd | undefined>(undefined);
  const theme = useColorScheme() === 'dark';
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const bd = await getBirthdayById(birthdayId);
      setBirthday(bd);
    })();
  }, [isFocused]);

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
  const birthdayAge = birthday ? new Date().getFullYear() - new Date(birthday.date).getFullYear() : '?';

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
      <ScrollView style={{ width: '100%' }}>
        <Nav
          topLeft={
            daysUntilBirthday !== null
              ? daysUntilBirthday === 0
                ? 'Today!'
                : `${daysUntilBirthday} days until birthday`
              : ''
          }
          bottomLeft={`${birthdayAge} Years Old`}
          topRight={'Budget'}
          bottomRight={'$' + String(birthday?.budget)}
        />
        {birthday ? (
          <>
            <Birthday birthday={birthday} />
            <QuickNote birthday={birthday} />
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};
