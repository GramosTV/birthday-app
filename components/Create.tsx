import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet, Text, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Nav } from './Nav';
import ColorPicker, { HueSlider, Panel1, Preview, Swatches } from 'reanimated-color-picker';
import { saveBirthday } from '../utils/AsyncStorage';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  MainPage: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Create() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [notes, setNotes] = useState('');
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [color, setColor] = useState<string>('#595959');
  const [photo, setPhoto] = useState<string | null>(null);
  const theme = useColorScheme() === 'dark';
  const navigation = useNavigation<NavigationProp>();
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
  const dateOfBirth = new Date(Number(year), Number(month) - 1, Number(day));
  const checkIfReady = () => {
    return name && surname && day && month && year && budget && photo;
  };
  const submit = async () => {
    await saveBirthday({
      id: uuid.v4() as string,
      name,
      surname,
      notes,
      date: dateOfBirth,
      budget: Number(budget),
      color,
      image: photo || '',
    });
    navigation.navigate('MainPage');
  };
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: theme ? '#000' : '#fff',
      }}
    >
      <View>
        <Nav
          topLeft="Upcomming"
          bottomLeft="ADD-BIRTHDAY"
          topRight="Budget"
          bottomRight={budget ? '$' + budget : '?'}
        />
        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              { borderRadius: 15, borderTopRightRadius: 0, borderBottomRightRadius: 0, color: theme ? '#fff' : '#000' },
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
              flex: 0,
              borderRadius: 15,
              color: theme ? '#fff' : '#000',
              paddingVertical: 10,
              height: 'auto',
              paddingHorizontal: 12,
            },
          ]}
          placeholder="Notes"
          placeholderTextColor="#666"
          value={notes}
          onChangeText={setNotes}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />

        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              { borderRadius: 15, borderTopRightRadius: 0, borderBottomRightRadius: 0, color: theme ? '#fff' : '#000' },
            ]}
            placeholder="Day"
            placeholderTextColor="#666"
            value={day}
            onChangeText={(value) => handleNumericInput(value, setDay, 1, 31)}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { color: theme ? '#fff' : '#000' }]}
            placeholder="Month"
            placeholderTextColor="#666"
            value={month}
            onChangeText={(value) => handleNumericInput(value, setMonth, 1, 12)}
            keyboardType="numeric"
          />
          <TextInput
            style={[
              styles.input,
              { borderRadius: 15, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, color: theme ? '#fff' : '#000' },
            ]}
            placeholder="Year"
            placeholderTextColor="#666"
            value={year}
            onChangeText={(value) => handleNumericInput(value, setYear, 110, new Date().getFullYear())}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              { borderRadius: 15, borderTopRightRadius: 0, borderBottomRightRadius: 0, color: theme ? '#fff' : '#000' },
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

        <ColorPicker style={{ width: '95%', marginHorizontal: 'auto' }} value={color} onComplete={onSelectColor}>
          <Preview />
          <Panel1 style={{ marginTop: 10 }} />
          <HueSlider style={{ marginTop: 10 }} />
          {/* <OpacitySlider style={{ marginTop: 10 }} /> */}
          <Swatches
            colors={[
              '#f00', // Red
              '#0f0', // Green
              '#00f', // Blue
              '#ff0', // Yellow
              '#f0f', // Magenta
              '#00ffff', // Cyan
              '#ff4500', // Orange Red
              '#8a2be2', // Blue Violet
            ]}
            style={{ marginTop: 10 }}
          />
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
          <Text style={[styles.photoButtonText, { fontSize: 18, color: theme ? '#fff' : '#000' }]}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
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
