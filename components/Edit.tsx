import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet, Text, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Nav } from './Nav';
import ColorPicker, { HueSlider, Panel1, Preview, Swatches } from 'reanimated-color-picker';
import { saveBirthday } from '../utils/AsyncStorage';
import { useNavigation } from '@react-navigation/native';
import { Birthday } from '../types';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  BirthdayPage: { birthdayId: string };
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export function Edit({ route }: any) {
  const navigation = useNavigation<NavigationProps>();
  const { birthday }: { birthday: Birthday } = route.params;

  const [name, setName] = useState(birthday.name);
  const [surname, setSurname] = useState(birthday.surname);
  const [notes, setNotes] = useState(birthday.notes);
  const [budget, setBudget] = useState(birthday.budget.toString());
  const [color, setColor] = useState(birthday.color);
  const [photo, setPhoto] = useState(birthday.image);
  const theme = useColorScheme() === 'dark';

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleNumericInput = (value: string, setValue: Function, min: number, max: number) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const parsedValue = parseInt(numericValue, 10);

    if (numericValue && parsedValue >= min && parsedValue <= max) {
      setValue(numericValue);
    } else if (!numericValue) {
      setValue('');
    }
  };

  const onSelectColor = ({ hex }: { hex: string }) => {
    setColor(hex);
  };

  const checkIfReady = () => {
    return name && surname && budget && photo;
  };

  const submit = async () => {
    await saveBirthday({
      id: birthday.id,
      name,
      surname,
      notes,
      date: birthday.date,
      budget: Number(budget),
      color,
      image: photo,
      notificationId: birthday.notificationId,
    });
    navigation.navigate('BirthdayPage', { birthdayId: birthday.id });
  };

  return (
    <GestureHandlerRootView>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          padding: 20,
          backgroundColor: theme ? '#000' : '#fff',
        }}
      >
        <View style={{ paddingBottom: 20 }}>
          <Nav
            topLeft="Upcoming"
            bottomLeft="EDIT-BIRTHDAY"
            topRight="Budget"
            bottomRight={budget ? '$' + budget : '?'}
          />
          <View style={styles.row}>
            <TextInput
              style={[
                styles.input,
                {
                  borderRadius: 15,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  color: theme ? '#fff' : '#000',
                },
              ]}
              placeholder="Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[
                styles.input,
                { borderRadius: 15, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, color: theme ? '#fff' : '#000' },
              ]}
              placeholder="Surname"
              placeholderTextColor="#666"
              value={surname}
              onChangeText={setSurname}
            />
          </View>

          <TextInput
            style={[
              styles.input,
              {
                height: 'auto',
                flex: 0,
                borderRadius: 15,
                color: theme ? '#fff' : '#000',
                paddingVertical: 10,
                paddingHorizontal: 12,
              },
            ]}
            placeholder="Notes"
            placeholderTextColor="#666"
            value={notes}
            onChangeText={setNotes}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.row}>
            <TextInput
              style={[
                styles.input,
                {
                  borderRadius: 15,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  color: theme ? '#fff' : '#000',
                },
              ]}
              placeholder="Budget"
              placeholderTextColor="#666"
              value={budget}
              onChangeText={(value) => handleNumericInput(value, setBudget, 0, 9999999)}
              keyboardType="numeric"
            />
            <TextInput
              style={[
                styles.input,
                {
                  borderRadius: 15,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderColor: color,
                  color: theme ? '#fff' : '#000',
                },
              ]}
              placeholder="Color"
              placeholderTextColor="#666"
              value={color}
              onChangeText={setColor}
            />
          </View>

          <ColorPicker
            style={{ width: '95%', marginHorizontal: 'auto', marginBottom: 10 }}
            value={color}
            onComplete={onSelectColor}
          >
            <Preview />
            <Panel1 style={{ marginTop: 10 }} />
            <HueSlider style={{ marginTop: 10 }} />
          </ColorPicker>
          <View style={styles.photoSection}>
            <View style={[styles.input, { borderRadius: 15 }]}>
              {photo ? <Image source={{ uri: photo }} style={{ width: 28, height: 28, marginRight: 5 }} /> : null}
              <Text style={{ color: '#666' }}>Photo</Text>
            </View>

            <TouchableOpacity
              onPress={pickImage}
              style={[styles.photoButton, { borderRadius: 15, borderColor: theme ? '#fff' : '#595959' }]}
            >
              <Text style={[styles.photoButtonText, { color: theme ? '#fff' : '#000' }]}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => (checkIfReady() ? submit() : null)}
            disabled={checkIfReady() ? false : true}
            style={[
              styles.photoButton,
              { flex: 0, borderColor: theme ? '#fff' : '#595959', opacity: checkIfReady() ? 1 : 0.15 },
            ]}
          >
            <Text style={[styles.photoButtonText, { fontSize: 18, color: theme ? '#fff' : '#000' }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#595959',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#fff',
    marginHorizontal: 5,
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ff0',
  },
  photoButton: {
    flex: 1,
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#404040',
    marginHorizontal: 5,
    borderRadius: 15,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 28,
    color: '#fff',
  },
});
