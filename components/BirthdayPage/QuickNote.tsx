import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import React from 'react';

export const QuickNote = () => {
  const theme = useColorScheme() === 'dark';
  return (
    <View style={{ marginTop: 60 }}>
      <Text style={{ color: theme ? '#fff' : '#000', fontSize: 22, fontFamily: 'Bold' }}>QUICK NOTE</Text>
      <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 16, fontFamily: 'Regular' }}>
        He is a good guy sigma grindest loremmm ipsum greatest man on earth love I him like kanye loves kanye on skibidi
        brainroot bot
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 60,
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
        >
          <Text style={{ fontSize: 16, color: theme ? '#fff' : '#000', fontFamily: 'Regular' }}>Change</Text>
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
