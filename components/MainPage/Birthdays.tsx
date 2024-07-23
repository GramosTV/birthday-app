import { View, Text, FlatList, useColorScheme, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

export const Birthdays = () => {
  const theme = useColorScheme() === 'dark';
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <MaterialIcons name="person" size={105} color="#1e1e1e" />
        <View
          style={{
            borderWidth: 2,
            borderColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 65,
            right: 10,
            backgroundColor: '#000',
            borderRadius: 35,
            padding: 3,
            height: 35,
            width: 35,
          }}
        >
          <Text style={{ color: '#fff', fontFamily: 'Bold' }}>3</Text>
        </View>
        <Text style={{ color: '#fff', fontFamily: 'Bold', fontSize: 18 }}>Adam</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ position: 'relative' }}>
      <LinearGradient
        colors={['transparent', theme ? '#000' : '#fff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, right: 0, width: '17%', height: '100%' }}
      ></LinearGradient>
      <FlatList
        style={{ zIndex: -1, flexDirection: 'row', height: 'auto', flexGrow: 0, paddingVertical: 40 }}
        data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
        numColumns={1}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        horizontal={true}
      />
    </View>
  );
};
