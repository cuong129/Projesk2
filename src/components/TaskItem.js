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

import {Image, StyleSheet, View, FlatList, ScrollView} from 'react-native';
import {colors} from '../res/colors';
import {wrap} from 'underscore';

export default class TaskItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assigns: [
        {
          id: 1,
        },
        {id: 2},
        {id: 3},
        {id: 4},
      ],
      tags: [
        {
          id: 1,
        },
        {id: 2},
        {id: 3},
        {id: 4},
      ],
    };
  }

  render() {
    return (
      <Card>
        <CardItem>
          <Left>
            <Body>
              <Text>Task Name</Text>
              <Text note>Note</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: colors.Positive}}>03:24:00</Text>
                <Text note> / 10:00:00</Text>
              </View>
            </Body>
          </Left>
        </CardItem>
        <View style={styles.cardItem}>
          <FlatList
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={5}
            data={this.state.assigns}
            renderItem={({item}) => <Image style={styles.imageCircle} />}
            keyExtractor={item => item.id}
            listKey={(item, index) => 'D' + index.toString()}
          />

          <FlatList
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={4}
            data={this.state.tags}
            renderItem={({item}) => (
              <View style={styles.tag}>
                <Text style={styles.titleTag}>aaa</Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
        <CardItem bordered footer>
          <Left>
            <View style={styles.chatbox}>
              <Icon name="chatbox" style={{color: '#58B6FF', fontSize: 20}} />
              <Text note>12</Text>
            </View>
            <View style={styles.checkBox}>
              <Icon
                name="checkbox-sharp"
                style={{color: '#49CC87', fontSize: 20}}
              />
              <Text note>0/3</Text>
            </View>
            <View style={styles.checkBox}>
              <Icon name="calendar" style={{color: '#FFC845', fontSize: 20}} />
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
  imageCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3773E1',
    marginRight: 4,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#DB3355',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  titleTag: {
    color: 'white',
    alignSelf: 'center',
  },
  cardItem: {
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
});
