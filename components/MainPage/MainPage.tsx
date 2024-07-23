import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Calendar } from "./Calendar";
import { CurrentMonth } from "./CurrentMonth";
import { Birthdays } from "./Birthdays";
import { Buttons } from "./Buttons";

export const MainPage = () => {
  return (
    <ScrollView>
      <CurrentMonth />
      <Buttons />
      <Birthdays />
      <Calendar />
    </ScrollView>
  );
};
