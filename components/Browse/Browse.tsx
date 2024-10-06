import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Nav } from '../Nav';
import { Buttons } from '../MainPage/Buttons';
import { BrowseBirthday } from './BrowseBirthday';

export const Browse = () => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <Nav topLeft={'Upcomming'} bottomLeft={'December'} topRight={'15 Dec'} bottomRight={'2025'} />
      <Buttons />
      <BrowseBirthday />
    </ScrollView>
  );
};
