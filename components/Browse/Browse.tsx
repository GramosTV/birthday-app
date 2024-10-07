import { View, Text, ScrollView, useColorScheme } from 'react-native';
import React from 'react';
import { Nav } from '../Nav';
import { Buttons } from '../MainPage/Buttons';
import { BrowseBirthday } from './BrowseBirthday';

export const Browse = () => {
  const theme = useColorScheme() === 'dark';
  return (
    <View
      style={{
        width: '100%',
        minHeight: '100%',
        paddingHorizontal: 10,
        backgroundColor: theme ? '#000' : '#fff',
      }}
    >
      <Nav
        topLeft={'Upcomming'}
        bottomLeft={new Date().toLocaleString('en-US', { month: 'long' })}
        topRight={new Date().getDate() + ' ' + new Date().toLocaleString('en-US', { month: 'short' })}
        bottomRight={new Date().getFullYear() + ''}
      />
      <Buttons />
      <BrowseBirthday />
    </View>
  );
};
