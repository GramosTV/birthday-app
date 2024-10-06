import { View, Text, FlatList, useColorScheme, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { getBirthdays } from '../../utils/AsyncStorage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Birthday } from '../../types';

export const Birthdays = () => {
  const theme = useColorScheme() === 'dark';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      setBirthdays(data);
    })();
  }, [isFocused]);

  // Separate upcoming and past birthdays
  const upcomingBirthdays = birthdays.filter((item) => {
    const birthdayDate = new Date(item.date);
    return birthdayDate.getMonth() === new Date().getMonth() && birthdayDate.getDate() >= new Date().getDate();
  });

  const pastBirthdays = birthdays.filter((item) => {
    const birthdayDate = new Date(item.date);
    return birthdayDate.getMonth() === new Date().getMonth() && birthdayDate.getDate() < new Date().getDate();
  });

  // Combine both arrays
  const sortedBirthdays = [...upcomingBirthdays, ...pastBirthdays];
  const navigation: any = useNavigation();
  const renderItem = ({ item }: any) => {
    const isPast = new Date(item.date).getDate() < new Date().getDate();
    const opacityStyle = isPast ? { opacity: 0.5 } : { opacity: 1 };

    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          marginHorizontal: 10,
          opacity: isPast ? 0.5 : 1,
        }}
        onPress={() =>
          navigation.navigate('BirthdayPage', {
            birthdayId: item.id,
          })
        }
      >
        <Image
          width={80}
          height={80}
          source={{ uri: item.image }}
          style={[{ borderRadius: 40 }, opacityStyle]} // Apply opacity based on whether it's past
        />
        <View
          style={{
            borderWidth: 2,
            borderColor: theme ? '#fff' : '#000',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 60,
            right: 0,
            backgroundColor: theme ? '#000' : '#fff',
            borderRadius: 35,
            padding: 3,
            height: 35,
            width: 35,
          }}
        >
          <Text style={{ color: theme ? '#fff' : '#000', fontFamily: 'Bold' }}>{new Date(item.date).getDate()}</Text>
        </View>
        <Text
          style={{ color: theme ? '#fff' : '#000', fontFamily: 'Bold', fontSize: 18, marginTop: 15, ...opacityStyle }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ position: 'relative' }}>
      <LinearGradient
        colors={['transparent', theme ? '#000' : '#fff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, right: 0, width: '17%', height: '100%' }}
      />
      <FlatList
        style={{ zIndex: -1, flexDirection: 'row', height: 'auto', flexGrow: 0, paddingVertical: 20 }}
        data={sortedBirthdays}
        numColumns={1}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        horizontal={true}
      />
    </View>
  );
};
