import { Text } from 'react-native';
import React from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin'; 
import {CommonActions} from '@react-navigation/native';

export default class MainScreen extends React.Component {
  render() {
    return (
      <Text>{this.props.route.params.user.user.email}</Text>
    )
  }
}