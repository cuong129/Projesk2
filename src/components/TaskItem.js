import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';

import {
  Image,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

export default class CardImageExample extends Component {
  render() {
    return (
      <Card>
        <CardItem>
          <Left>
            <Body>
              <Text>Task Name</Text>
              <Text note>Note</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <FlatList horizontal />
        </CardItem>
        <CardItem bordered footer>
          <Left>
            <View style={styles.chatbox}>
              <Icon name="chatbox" style={{color: '#58B6FF', fontSize: 20}} />
              <Text note>12</Text>
            </View>
            <View style={styles.checkBox}>
              <Icon
                name="checkbox-sharp"
                style={{color: '#8F7CEF', fontSize: 20}}
              />
              <Text note>0/3</Text>
            </View>
            <View style={styles.checkBox}>
              <Icon name="calendar" style={{color: '#49CC87', fontSize: 20}} />
              <Text note>May 24, 2019</Text>
            </View>
          </Left>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  chatbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
});
