import { View, Text, Image, useColorScheme, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Birthday } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getOrdinalSuffix } from '../../utils/getOrdinalSuffix';

type RootStackParamList = {
  BirthdayPage: { birthdayId: string };
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'BirthdayPage'>;

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

interface BrowseBirthdayProps {
  filteredBirthdays: Birthday[];
}

export const SearchBirthday = ({ filteredBirthdays }: BrowseBirthdayProps) => {
  const theme = useColorScheme() === 'dark';
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProps>();

  const renderItem = ({ item }: { item: Birthday }) => (
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
        <Image source={{ uri: item.image }} width={80} height={80} style={{ marginRight: 20, borderRadius: 3 }} />
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

  return (
    <SafeAreaView style={{ minHeight: '100%' }}>
      <FlatList
        style={{ zIndex: -1, flexGrow: 1, paddingVertical: 15 }}
        data={filteredBirthdays}
        numColumns={1}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};
