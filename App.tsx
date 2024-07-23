import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Calendar } from './components/MainPage/Calendar';
import { useColorScheme } from 'react-native';
import { MainPage } from './components/MainPage/MainPage';
import * as Font from 'expo-font';
import { useEffect } from 'react';


export default function App() {
  const theme = useColorScheme() === 'dark'

  return (
      <SafeAreaView style={{...styles.container, backgroundColor: theme ? '#000' : '#fff'}}>
      <MainPage />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
