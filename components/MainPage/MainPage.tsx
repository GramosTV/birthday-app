import { View, Text } from 'react-native'
import React from 'react'
import { Calendar } from './Calendar'
import { CurrentMonth } from './CurrentMonth'
import { Birthdays } from './Birthdays'

export const MainPage = () => {
  return (
    <View>
      <CurrentMonth />
      <Birthdays />
      <Calendar />
    </View>
  )
}
