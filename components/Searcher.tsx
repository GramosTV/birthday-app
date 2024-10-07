import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export const Searcher = ({ filteredBirthdays, inputText, allBirthdays, searchFlag }: any) => {
  const navigation: any = useNavigation();
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
