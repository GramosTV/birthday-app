import { View, Text, Image, useColorScheme } from 'react-native';
import React from 'react';
import { Birthday as bd } from '../types';

interface BirthdayProps {
  birthday: bd;
}

export const Birthday = ({ birthday }: BirthdayProps) => {
  const theme = useColorScheme() === 'dark';
  const birthdayDate = new Date(birthday.date);
  const formattedDate = `${birthdayDate.getDate()}.${birthdayDate.getMonth() + 1}.${birthdayDate.getFullYear()}`;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{
            uri: birthday.image,
          }}
          width={80}
          height={80}
          style={{ marginRight: 20, borderRadius: 3 }}
        />
        <View style={{ justifyContent: 'space-around' }}>
          <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Bold' }}>{birthday.name}</Text>
          <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Bold' }}>{birthday.surname}</Text>
          <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 12, fontFamily: 'Regular' }}>
            Was born on {formattedDate}
          </Text>
        </View>
      </View>
      <View style={{ width: 3, height: 30, backgroundColor: birthday.color, borderRadius: 5 }}></View>
    </View>
  );
};
