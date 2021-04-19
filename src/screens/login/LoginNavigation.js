import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import MainScreen from '../main/MainScreen';

const Stack = createStackNavigator();

export default function() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}/> 
        <Stack.Screen
          name="Main"
          component={MainScreen}        
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}