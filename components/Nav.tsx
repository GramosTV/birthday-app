import { View, Text, useColorScheme } from 'react-native';
import React from 'react';
interface NavProps {
  topLeft: string;
  bottomLeft: string;
  topRight: string;
  bottomRight: string;
  num?: number;
}
export const Nav = ({ topLeft, bottomLeft, topRight, bottomRight, num }: NavProps) => {
  const theme = useColorScheme() === 'dark';

  return (
    <View
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 40,
        paddingTop: 20,
        paddingBottom: 10,
        width: '100%',
      }}
    >
      <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
        <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 14, fontFamily: 'Bold' }}>{topLeft}</Text>
        <Text style={{ color: theme ? '#fff' : '#000', fontSize: 28, fontFamily: 'Bold' }}>
          {bottomLeft} {typeof num !== 'number' ? null : <Text style={{ fontSize: 14 }}>({num})</Text>}
        </Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
        <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 14, fontFamily: 'Bold' }}>{topRight}</Text>
        <Text style={{ color: theme ? '#fff' : '#000', fontSize: 28, fontFamily: 'Bold' }}>{bottomRight}</Text>
      </View>
    </View>
  );
};
