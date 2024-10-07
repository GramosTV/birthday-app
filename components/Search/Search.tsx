import { Animated, Dimensions, Easing, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Nav } from '../Nav';
import { Buttons } from '../MainPage/Buttons';
import moment from 'moment';
import { SearchBirthday } from './SearchBirthday';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { getBirthdays } from '../../utils/AsyncStorage';
import { Birthday } from '../../types';

export const Search = () => {
  const theme = useColorScheme() === 'dark';
  const route = useRoute();
  const { filteredBirthdays, inputText, allBirthdays } = route.params as any;

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        paddingHorizontal: 10,
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
