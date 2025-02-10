import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import React from 'react';
import { Birthday as bd } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  Edit: { birthday: bd };
};
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Edit'>;
interface BirthdayProps {
  birthday: bd;
}

export const QuickNote = ({ birthday }: BirthdayProps) => {
  const theme = useColorScheme() === 'dark';
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={{ marginTop: 40 }}>
      <Text style={{ color: theme ? '#fff' : '#000', fontSize: 22, fontFamily: 'Bold' }}>NOTES</Text>
      <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 16, fontFamily: 'Regular' }}>
        {birthday.notes || 'Edit to add notes'}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 40,
        }}
      >
        <TouchableOpacity
          style={{
            height: 53,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme ? '#fff' : '#000',
            borderWidth: 2,
            borderRadius: 20,
            paddingHorizontal: 20,
            flex: 1,
          }}
          onPress={() => navigation.navigate('Edit', { birthday })}
        >
          <Text style={{ fontSize: 16, color: theme ? '#fff' : '#000', fontFamily: 'Regular' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: theme ? '#fff' : '#000',
            height: 53,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme ? '#fff' : '#000',
            borderWidth: 2,
            borderRadius: 20,
            paddingHorizontal: 20,
            flex: 1,
            marginLeft: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'Regular', color: theme ? '#000' : '#fff' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
