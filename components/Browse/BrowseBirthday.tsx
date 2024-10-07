import { View, Text, Image, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getBirthdays } from '../../utils/AsyncStorage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Birthday } from '../../types';
const getNextBirthday = (birthDate: Date) => {
  const today = new Date();
  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const isToday = today.getDate() === nextBirthday.getDate() && today.getMonth() === nextBirthday.getMonth();

  if (isToday) {
    return '';
  }
  const dayOfWeek = nextBirthday.toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfMonth = nextBirthday.getDate();
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  const ordinalSuffix = getOrdinalSuffix(dayOfMonth);
  return `${dayOfWeek} ${dayOfMonth}${ordinalSuffix}`;
};
const getBirthdayNumber = (birthDate: Date) => {
  const today = new Date();
  let currentYear = today.getFullYear();
  let birthdayNumber = currentYear - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    birthdayNumber--;
  }
  const isToday = today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();

  if (isToday) {
    return `They just turned ${birthdayNumber}!`;
  }

  return `They will turn ${birthdayNumber + 1} on`;
};

export const BrowseBirthday = () => {
  const theme = useColorScheme() === 'dark';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();
  const navigation: any = useNavigation();
  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      const currentMonth = new Date().getMonth();
      const upcomingBirthdays = data.filter((bd: Birthday) => {
        const birthdayDate = new Date(bd.date);
        return birthdayDate.getMonth() === currentMonth && birthdayDate.getDate() >= new Date().getDate();
      });
      setBirthdays(upcomingBirthdays);
    })();
  }, [isFocused]);
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 5,
          borderColor: '#292929',
          borderWidth: 2,
          borderRadius: 6,
          padding: 10,
        }}
        onPress={() =>
          navigation.navigate('BirthdayPage', {
            birthdayId: item.id,
          })
        }
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{
              uri: item.image,
            }}
            width={80}
            height={80}
            style={{ marginRight: 20, borderRadius: 3 }}
          />
          <View style={{ justifyContent: 'space-around' }}>
            <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Bold' }}>{item.name}</Text>
            <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Bold' }}>{item.surname}</Text>
            <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 12, fontFamily: 'Regular' }}>
              {getBirthdayNumber(new Date(item.date))} {getNextBirthday(new Date(item.date))}
            </Text>
          </View>
        </View>
        <View style={{ width: 3, height: 30, backgroundColor: item.color, borderRadius: 5 }}></View>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      style={{
        zIndex: -1,
        flexGrow: 1,
        paddingVertical: 40,
      }}
      data={birthdays}
      numColumns={1}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};
