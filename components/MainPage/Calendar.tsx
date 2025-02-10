import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, useColorScheme, PanResponder, Animated } from 'react-native';
import moment from 'moment';
import { getBirthdays } from '../../utils/AsyncStorage';
import { Birthday } from '../../types';
import { useIsFocused } from '@react-navigation/native';

interface CalendarProps {
  currentDate: moment.Moment;
  setCurrentDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
}

export const Calendar = ({ currentDate, setCurrentDate }: CalendarProps) => {
  const today = moment();
  const theme = useColorScheme() === 'dark';
  const currentWeekdayIndex = today.day();
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [swipeHandled, setSwipeHandled] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      setBirthdays(data);
    })();
  }, [isFocused]);

  const swipeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: () => {},
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
    fadeOut(() => {
      setCurrentDate((prevDate) => {
        const newDate = moment(prevDate).add(1, 'month');
        newDate.set({ year: new Date().getFullYear() });
        fadeIn();
        return newDate;
      });
    });
  };

  const handleSwipeRight = () => {
    fadeOut(() => {
      setCurrentDate((prevDate) => {
        const newDate = moment(prevDate).subtract(1, 'month');
        newDate.set({ year: new Date().getFullYear() });
        fadeIn();
        return newDate;
      });
    });
  };

  const fadeOut = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start(() => callback());
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = moment.weekdaysShort();
    return (
      <View style={styles.daysOfWeek}>
        {daysOfWeek.map((day, index) => (
          <Text
            key={index}
            style={{
              ...styles.dayOfWeekText,
              color: theme
                ? index === currentWeekdayIndex
                  ? '#fff'
                  : '#FFFFFF80'
                : index === currentWeekdayIndex
                ? '#000'
                : '#555',
            }}
          >
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderDays = () => {
    const startOfMonth = moment(currentDate).startOf('month');
    const endOfMonth = moment(currentDate).endOf('month');
    const days = [];
    const daysInMonth = endOfMonth.date();

    for (let i = 0; i < startOfMonth.day(); i++) {
      days.push(<View key={`pad-${i}`} style={styles.day} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStyle = today.isSame(moment(currentDate).date(day), 'day') ? styles.currentDay : styles.day;
      days.push(
        <View key={day} style={dayStyle}>
          <Text
            style={
              dayStyle === styles.currentDay
                ? {
                    color: '#fff',
                    backgroundColor: '#2b2b2b',
                    borderRadius: 20,
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                  }
                : { color: theme ? '#FFFFFF80' : '#000' }
            }
          >
            {day}
          </Text>
          <View style={{ marginBottom: 10 }}>
            {birthdays.map((e: Birthday) => {
              if (new Date(e.date).getDate() === day && new Date(e.date).getMonth() === currentDate.month()) {
                return (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }} key={e.id}>
                    <Text style={{ fontSize: 10, color: theme ? '#fff' : '#000', fontFamily: 'Regular' }}>
                      {e.name}
                    </Text>
                    <View style={{ backgroundColor: e.color, width: 30, height: 2 }}></View>
                  </View>
                );
              }
              return null;
            })}
          </View>
        </View>
      );
    }

    return <View style={styles.days}>{days}</View>;
  };

  return (
    <Animated.View {...swipeResponder.panHandlers} style={[styles.container, { opacity: fadeAnim }]}>
      {renderDaysOfWeek()}
      {renderDays()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: '#3d3d3d',
  },
  dayOfWeekText: {
    width: (Dimensions.get('window').width - 20) / 7,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: (Dimensions.get('window').width - 20) / 7,
    height: 85,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#3d3d3d',
    paddingTop: 13,
  },
  currentDay: {
    width: (Dimensions.get('window').width - 20) / 7,
    height: 85,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#3d3d3d',
    paddingTop: 5,
  },
});
