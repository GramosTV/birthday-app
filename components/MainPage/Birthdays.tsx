import { View, Text, FlatList, useColorScheme, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { getBirthdays } from '../../utils/AsyncStorage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Birthday } from '../../types';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
interface BirthdayProps {
  currentDate: moment.Moment;
}
type RootStackParamList = {
  BirthdayPage: { birthdayId: string };
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export const Birthdays = ({ currentDate }: BirthdayProps) => {
  const theme = useColorScheme() === 'dark';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      setBirthdays(data);
    })();
  }, [isFocused]);

  const upcomingBirthdays = birthdays.filter((item) => {
    const birthdayDate = moment(item.date);
    return birthdayDate.month() === currentDate.month() && birthdayDate.date() >= currentDate.date();
  });

  const pastBirthdays = birthdays.filter((item) => {
    const birthdayDate = moment(item.date);
    return birthdayDate.month() === currentDate.month() && birthdayDate.date() < currentDate.date();
  });

  const sortedBirthdays = [...upcomingBirthdays, ...pastBirthdays.reverse()];
  const navigation = useNavigation<NavigationProps>();

  const renderItem = ({ item }: { item: Birthday }) => {
    const isPast = moment(item.date).date() < currentDate.date();
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
        <Image width={80} height={80} source={{ uri: item.image }} style={[{ borderRadius: 40 }, opacityStyle]} />
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
          <Text style={{ color: theme ? '#fff' : '#000', fontFamily: 'Bold' }}>{moment(item.date).date()}</Text>
        </View>
        <Text
          style={{ color: theme ? '#fff' : '#000', fontFamily: 'Bold', fontSize: 18, marginTop: 15, ...opacityStyle }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  if (!sortedBirthdays.length)
    return (
      <View
        style={{
          paddingVertical: 42,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative', marginRight: 10 }}>
          <MaterialIcons name="cake" size={75} color="gray" />
          <MaterialIcons
            name="cancel"
            size={50}
            color={theme ? 'white' : 'black'}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -25 }, { translateY: -25 }],
            }}
          />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme ? '#fff' : '#000', fontFamily: 'Bold', fontSize: 18 }}>
            No birthdays this month?
          </Text>
          <Text style={{ color: theme ? '#fff' : '#000', fontSize: 18, fontFamily: 'Regular' }}>
            Go add some right now
          </Text>
        </View>
      </View>
    );
  return (
    <View style={{ position: 'relative', minWidth: '100%' }}>
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
