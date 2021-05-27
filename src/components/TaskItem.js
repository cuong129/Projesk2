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
import {colors, ColorBoard} from '../res/colors';
import {wrap} from 'underscore';

export default class TaskItem extends Component {
  constructor(props) {
    super(props);
  }
  renderChecklist(checklist) {
    var numChecked = 0;
    for (var i = 0; i < checklist.length; i++) {
      if (checklist[i].hasChecked) numChecked++;
    }
    return numChecked + '/' + checklist.length;
  }
  dateDiff(start, end) {
    var startDate = new Date(start.toDate());
    startDate.setSeconds(0);
    var endDate = new Date(end.toDate());
    endDate.setSeconds(0);
    return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  }
  hourDiff(start, end) {
    var startDate = new Date(start.toDate());
    startDate.setSeconds(0);
    var endDate = new Date(end.toDate());
    endDate.setSeconds(0);
    return Math.floor((endDate - startDate) / (1000 * 60 * 60)) % 24;
  }
  minuteDiff(start, end) {
    var startDate = new Date(start.toDate());
    startDate.setSeconds(0);
    var endDate = new Date(end.toDate());
    endDate.setSeconds(0);
    return Math.floor((endDate - startDate) / (1000 * 60)) % 60;
  }
  renderCompleteTime(start, end) {
    const date = this.dateDiff(start, end);
    const str1 = date !== 0 ? date + 'd' : '';
    const hour = this.hourDiff(start, end);
    const str2 = hour !== 0 ? hour + 'h' : '';
    const minute = this.minuteDiff(start, end);
    const str3 = minute !== 0 ? minute + 'min' : '';
    return str1 + ' ' + str2 + ' ' + str3;
  }
  formatDate(date) {
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;
    return (
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ` +
      hour +
      ':' +
      minute
    );
  }
  render() {
    const {item} = this.props;
    return (
      <Card>
        <CardItem>
          <Left>
            <Body>
              <Text>{item.name}</Text>
              <Text note>{item.note}</Text>
              {item.complete != null && item.complete.hasCompleted && (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color:
                        item.complete.date <= item.DueDate
                          ? colors.Positive
                          : colors.Danger,
                      fontSize: 14,
                    }}>
                    {this.renderCompleteTime(
                      item.StartDate,
                      item.complete.date,
                    )}
                  </Text>
                  <Text style={{fontSize: 14}}>
                    {' / ' +
                      this.renderCompleteTime(item.StartDate, item.DueDate)}
                  </Text>
                </View>
              )}
            </Body>
          </Left>
        </CardItem>
        <View style={styles.cardItem}>
          <FlatList
            columnWrapperStyle={{flexWrap: 'wrap'}}
            numColumns={5}
            data={item.assigns}
            renderItem={({item}) => (
              <Image style={styles.imageCircle} source={{uri: item.photoURL}} />
            )}
            keyExtractor={item => item.uid}
          />
          {item.tag != null && (
            <FlatList
              columnWrapperStyle={{flexWrap: 'wrap'}}
              numColumns={4}
              data={item.tag}
              renderItem={({item}) => (
                <View
                  style={[
                    styles.tag,
                    {backgroundColor: ColorBoard[item.colorIndex]},
                  ]}>
                  <Text style={styles.titleTag}>{item.name}</Text>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>
        <CardItem bordered footer>
          <Left>
            <View style={styles.chatbox}>
              <Icon name="chatbox" style={{color: '#58B6FF', fontSize: 20}} />
              <Text note>{item.comments ? item.comments.length : 0}</Text>
            </View>
            {item.checklist != null && (
              <View style={styles.checkBox}>
                <Icon
                  name="checkbox-sharp"
                  style={{color: '#49CC87', fontSize: 20}}
                />
                <Text note>{this.renderChecklist(item.checklist)}</Text>
              </View>
            )}
            {item.DueDate != null && (
              <View style={styles.checkBox}>
                <Icon
                  name="calendar"
                  style={{color: '#FFC845', fontSize: 20}}
                />
                <Text note>{this.formatDate(item.DueDate.toDate())}</Text>
              </View>
            )}
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
