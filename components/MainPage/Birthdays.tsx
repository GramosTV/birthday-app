import { View, Text, FlatList } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

export const Birthdays = () => {
    const renderItem = ({ item, index }: { item: any, index: number }) => {

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <MaterialIcons name='person' size={105} color="#1e1e1e" />
                <View style={{ borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', position: "absolute", top: 65, right: 10, backgroundColor: '#000',  borderRadius: 35, padding: 3, height: 35, width: 35}}><Text style={{color: '#fff',fontFamily: 'BricolageGrotesque',}}>3</Text></View>
                <Text style={{ color: '#fff', fontFamily: 'BricolageGrotesque', fontSize: 18 }}>Adam</Text>
            </View>
        )
    };
    return (
        <LinearGradient colors={["transparent", "#000"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0.8, 1 ]}style={{zIndex: 99}}>
        <FlatList style={{ zIndex: -1, flexDirection: 'row', height: 'auto', flexGrow: 0, paddingVertical: 40 }} data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]} numColumns={1} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} horizontal={true} />
        </LinearGradient>
    )
}