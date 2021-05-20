import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class TaskScreen extends Component {
  render() {
    return (
      <View>
        <Text>{ this.props.route.params.task.name}</Text>
      </View>
    );
  }
}
