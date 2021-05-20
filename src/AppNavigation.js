import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Badge,
  StyleProvider,
  Title,
} from 'native-base';
import {StatusBar} from 'react-native';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import LoginScreen from './screens/LoginScreen';

import NotifyScreen from './screens/NotifyScreen';
import MyProjectScreen from './screens/MyProjectScreen';
import MyTaskScreen from './screens/MyTaskScreen';
import AccountScreen from './screens/AccountScreen';

import ProjectScreen from './screens/ProjectScreen';
import TaskScreen from './screens/TaskScreen';

const Stack = createStackNavigator();
export default function () {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={'none'}>
        {/* <MainStack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Task" component={TaskScreen} />
        <Stack.Screen name="Project" component={ProjectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();
function MainScreen() {
  return (
    <Tab.Navigator
      tabBar={props => {
        return (
          <StyleProvider style={getTheme(material)}>
            <Footer>
              <FooterTab>
                <Button
                  badge
                  vertical
                  active={props.state.index === 0}
                  onPress={() => props.navigation.navigate('Notify')}>
                  <Badge>
                    <Text>0</Text>
                  </Badge>
                  <Icon name="notifications" />
                  <Text>Notify</Text>
                </Button>
                <Button
                  vertical
                  active={props.state.index === 1}
                  onPress={() => props.navigation.navigate('MyProject')}>
                  <Icon name="cube" />
                  <Text>project</Text>
                </Button>
                <Button
                  vertical
                  active={props.state.index === 2}
                  onPress={() => props.navigation.navigate('MyTask')}>
                  <Icon name="checkmark-done-circle" />
                  <Text>my task</Text>
                </Button>
                <Button
                  vertical
                  active={props.state.index === 3}
                  onPress={() => props.navigation.navigate('Account')}>
                  <Icon name="person" />
                  <Text>account</Text>
                </Button>
              </FooterTab>
            </Footer>
          </StyleProvider>
        );
      }}>
      <Tab.Screen name="Notify" component={NotifyScreen} />
      <Tab.Screen name="MyProject" component={MyProjectScreen} />
      <Tab.Screen name="MyTask" component={MyTaskScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
