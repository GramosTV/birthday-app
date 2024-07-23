import { View, Text, useColorScheme } from 'react-native';
import React, { useEffect } from 'react';

export const CurrentMonth = () => {
  const theme = useColorScheme() === 'dark';

  return (
    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingVertical: 40 }}>
      <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
        <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 14, fontFamily: 'Regular' }}>Upcomming</Text>
        <Text style={{ color: theme ? '#fff' : '#000', fontSize: 28, fontFamily: 'Bold' }}>
          NOVEMBER <Text style={{ fontSize: 14 }}>(6)</Text>
        </Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
        <Text style={{ color: theme ? '#FFFFFF80' : '#555', fontSize: 14, fontFamily: 'Regular' }}>Budget</Text>
        <Text style={{ color: theme ? '#fff' : '#000', fontSize: 28, fontFamily: 'Bold' }}>$213</Text>
      </View>
    </View>
  );
};
