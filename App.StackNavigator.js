import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import homeScreen from './app/screens/homeScreen.js'

// var navigation = this.props.navigation;
// this.props.navigation.navigate('Home')  --> change page in stack navigator
const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator headerMode="none" navigationOptions={{headerVisible: false,}}>
            <Stack.Screen name="Home" component={homeScreen} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
