import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Birthday } from '../Birthday';
import { Nav } from '../Nav';
import { QuickNote } from './QuickNote';

export const BirthdayPage = () => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <Nav />
      <Birthday />
      <QuickNote />
    </ScrollView>
  );
};
