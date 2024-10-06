import { View, Text, Image, useColorScheme, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getBirthdays } from '../../utils/AsyncStorage';
import { useIsFocused } from '@react-navigation/native';
import { Birthday } from '../../types';

export const BrowseBirthday = () => {
  const theme = useColorScheme() === 'dark';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const data = await getBirthdays();
      setBirthdays(data);
    })();
  }, [isFocused]);
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 5,
          borderColor: '#292929',
          borderWidth: 2,
          borderRadius: 6,
          padding: 10,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Skibidi_toilet_screenshot.webp/220px-Skibidi_toilet_screenshot.webp.png',
            }}
            width={80}
            height={80}
            style={{ marginRight: 20, borderRadius: 3 }}
          />
          <View style={{ justifyContent: 'space-around' }}>
            <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Bold' }}>Adam</Text>
            <Text style={{ color: theme ? '#fff' : '#222', fontSize: 22, fontFamily: 'Bold' }}>Markowski</Text>
            <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 12, fontFamily: 'Regular' }}>
              11th Birthday | Monday 2nd
            </Text>
          </View>
        </View>
        <View style={{ width: 3, height: 30, backgroundColor: 'red', borderRadius: 5 }}></View>
      </View>
    );
  };
  return (
    <FlatList
      style={{
        zIndex: -1,
        flexGrow: 1,
        paddingVertical: 40,
      }}
      data={birthdays}
      numColumns={1}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};
