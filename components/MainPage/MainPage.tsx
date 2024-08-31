import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Calendar } from './Calendar';
import { Nav } from '../Nav';
import { Birthdays } from './Birthdays';
import { Buttons } from './Buttons';

export const MainPage = () => {
  return (
    <ScrollView>
      <Nav />
      <Buttons />
      <Birthdays />
      <Calendar />
    </ScrollView>
  );
};
