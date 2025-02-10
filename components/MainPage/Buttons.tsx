import { View, Text, useColorScheme, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { exportBirthdays } from '../../utils/Misc';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  MainPage: undefined;
  Browse: undefined;
  Create: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export const Buttons = () => {
  const theme = useColorScheme() === 'dark';
  const navigation = useNavigation<NavigationProps>();
  const handleExport = () => {
    Alert.alert(
      'Choose Export Format',
      'Do you want to export as JSON or CSV?',
      [
        {
          text: 'JSON',
          onPress: async () => await exportBirthdays(true),
        },
        {
          text: 'CSV',
          onPress: async () => await exportBirthdays(false),
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: theme ? '#fff' : '#000',
            height: 53,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme ? '#fff' : '#000',
            borderWidth: 2,
            borderRadius: 53,
            paddingHorizontal: 20,
          }}
          onPress={() => navigation.navigate('MainPage')}
        >
          <Text style={{ fontSize: 14, fontFamily: 'Regular', color: theme ? '#000' : '#fff' }}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 53,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme ? '#fff' : '#000',
            borderWidth: 2,
            borderRadius: 53,
            paddingHorizontal: 20,
            marginLeft: 12,
          }}
          onPress={() => navigation.navigate('Browse')}
        >
          <Text style={{ fontSize: 14, color: theme ? '#fff' : '#000', fontFamily: 'Regular' }}>Events</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            width: 53,
            height: 53,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme ? '#fff' : '#000',
            borderWidth: 2,
            borderRadius: 53,
            marginRight: 10,
          }}
          onPress={handleExport}
        >
          <AntDesign name="export" size={27} color={theme ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 53,
            height: 53,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme ? '#fff' : '#000',
            borderWidth: 2,
            borderRadius: 53,
          }}
          onPress={() => navigation.navigate('Create')}
        >
          <AntDesign name="plus" size={27} color={theme ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
