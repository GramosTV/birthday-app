import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import moment from 'moment';
import { getBirthdays } from '../../utils/AsyncStorage';
import { Birthday } from '../../types';
import { useIsFocused } from '@react-navigation/native';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const today = moment();
  const theme = useColorScheme() === 'dark';
  const currentWeekdayIndex = today.day();
  const [birthdays, setBirthdays] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      setBirthdays(data);
    })();
  }, [isFocused]);
  const renderHeader = () => {
    return null;
    // return (
    //   <View style={styles.header}>
    //     <TouchableOpacity onPress={() => setCurrentDate(moment(currentDate).subtract(1, 'month'))}>
    //       <Text style={styles.navButton}>Prev</Text>
    //     </TouchableOpacity>
    //     <Text style={styles.headerText}>{currentDate.format('MMMM YYYY')}</Text>
    //     <TouchableOpacity onPress={() => setCurrentDate(moment(currentDate).add(1, 'month'))}>
    //       <Text style={styles.navButton}>Next</Text>
    //     </TouchableOpacity>
    //   </View>
    // );
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
                    paddingHorizontal: 20,
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
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
    <View style={styles.container}>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDays()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButton: {
    fontSize: 18,
    color: '#007AFF',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    height: 90,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#3d3d3d',
    paddingTop: 13,
  },
  currentDay: {
    width: (Dimensions.get('window').width - 20) / 7,
    height: 90,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#3d3d3d',
    paddingTop: 5,
  },
});
