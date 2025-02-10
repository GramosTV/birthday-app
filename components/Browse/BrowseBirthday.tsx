import { View, Text, Image, useColorScheme, FlatList, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { getBirthdays } from '../../utils/AsyncStorage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Birthday } from '../../types';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';
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
  currentDate: moment.Moment;
  setCurrentDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
}
export const BrowseBirthday = ({ currentDate, setCurrentDate }: BrowseBirthdayProps) => {
  const theme = useColorScheme() === 'dark';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProps>();
  const [swipeHandled, setSwipeHandled] = useState(false);
  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      const currentMonth = currentDate.month();
      const currentDay = currentDate.date();
      const upcomingBirthdays = data.filter((bd: Birthday) => {
        const birthdayDate = moment(bd.date);
        return birthdayDate.month() === currentMonth && birthdayDate.date() >= currentDay;
      });

      setBirthdays(upcomingBirthdays);
    })();
  }, [isFocused, currentDate]);
  const swipeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {},
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;

        if (!swipeHandled) {
          if (dx > 50) {
            handleSwipeRight();
            setSwipeHandled(true);
          } else if (dx < -50) {
            handleSwipeLeft();
            setSwipeHandled(true);
          }
        }
      },
      onPanResponderTerminate: () => {
        setSwipeHandled(false);
      },
    })
  ).current;
  const handleSwipeLeft = () => {
    setCurrentDate((prevDate) => {
      const newDate = moment(prevDate).add(1, 'month');
      newDate.set({ year: new Date().getFullYear() });
      return newDate;
    });
  };

  const handleSwipeRight = () => {
    setCurrentDate((prevDate) => {
      const newDate = moment(prevDate).subtract(1, 'month');
      newDate.set({ year: new Date().getFullYear() });
      return newDate;
    });
  };

  const renderItem = ({ item, index }: { item: Birthday; index: number }) => {
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
  if (!birthdays.length) {
    return (
      <View
        {...swipeResponder.panHandlers}
        style={{ paddingTop: 100, minHeight: Dimensions.get('window').height - 100 }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <MaterialIcons name="cake" size={150} color="gray" />
          <MaterialIcons
            name="cancel"
            size={100}
            color={theme ? 'white' : 'black'}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [
                { translateX: -50 }, // Move left by half of its width (60 / 2)
                { translateY: -50 }, // Move up by half of its height (60 / 2)
              ],
            }}
          />
        </View>
        <Text style={{ color: theme ? '#fff' : '#222', fontSize: 24, fontFamily: 'Bold', textAlign: 'center' }}>
          No Birthdays?
        </Text>
        <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Regular', textAlign: 'center' }}>
          Go add some right now
        </Text>
      </View>
    );
  }
  return (
    <View {...swipeResponder.panHandlers} style={{ minHeight: '100%' }}>
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
    </View>
  );
};
