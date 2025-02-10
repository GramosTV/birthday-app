import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Birthday } from '../types';
type RootStackParamList = {
  Search: { filteredBirthdays: Birthday[]; inputText: string; allBirthdays: Birthday[]; searchFlag: number | null };
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export const Searcher = ({ filteredBirthdays, inputText, allBirthdays, searchFlag }: any) => {
  const navigation = useNavigation<NavigationProps>();
  useEffect(() => {
    if (searchFlag === null) return;
    if (searchFlag === 0) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Search', { filteredBirthdays, inputText, allBirthdays, searchFlag });
  }, [searchFlag]);
  return null;
};
