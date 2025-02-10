import { View, useColorScheme } from 'react-native';
import React from 'react';
import { Nav } from '../Nav';
import { SearchBirthday } from './SearchBirthday';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Birthday } from '../../types';

type RouteParams = {
  params: {
    filteredBirthdays?: Birthday[];
    inputText?: string;
    allBirthdays?: Birthday[];
  };
};

export const Search = () => {
  const route = useRoute<RouteProp<RouteParams>>();
  const theme = useColorScheme() === 'dark';
  const { filteredBirthdays = [], inputText = '', allBirthdays = [] } = route.params || {};

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        paddingHorizontal: 15,
        backgroundColor: theme ? '#000' : '#fff',
        position: 'relative',
      }}
    >
      <Nav
        topLeft={'Upcoming'}
        bottomLeft={'SEARCH'}
        topRight={'Found'}
        bottomRight={
          filteredBirthdays.length || inputText.length > 0 ? filteredBirthdays.length + '' : allBirthdays.length + ''
        }
      />
      <SearchBirthday
        filteredBirthdays={filteredBirthdays.length || inputText.length > 0 ? filteredBirthdays : allBirthdays}
      />
    </View>
  );
};
