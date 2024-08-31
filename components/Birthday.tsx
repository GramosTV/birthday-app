import { View, Text, Image, useColorScheme } from 'react-native';
import React from 'react';

export const Birthday = () => {
  const theme = useColorScheme() === 'dark';
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Skibidi_toilet_screenshot.webp/220px-Skibidi_toilet_screenshot.webp.png',
          }}
          width={80}
          height={80}
          style={{ marginRight: 20 }}
        />
        <View style={{ justifyContent: 'space-around' }}>
          <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Bold' }}>Adam</Text>
          <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Bold' }}>Markowski</Text>
          <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 12, fontFamily: 'Regular' }}>
            Was born on 11.09.2001
          </Text>
        </View>
      </View>
      <View style={{ width: 3, height: 30, backgroundColor: 'red', borderRadius: 5 }}></View>
    </View>
  );
};
