import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

export const Buttons = () => {
  const theme = useColorScheme() === 'dark';
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        >
          <Text style={{ fontSize: 14, color: theme ? '#fff' : '#000', fontFamily: 'Regular' }}>Events</Text>
        </TouchableOpacity>
      </View>
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
      >
        <AntDesign name="plus" size={27} color={theme ? '#fff' : '#000'} />
      </TouchableOpacity>
    </View>
  );
};
