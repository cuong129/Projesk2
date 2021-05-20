import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Icon,
  Right,
  Button,
  Left,
  Body,
} from 'native-base';
import {FlatList, StyleSheet, View, Text, ScrollView} from 'react-native';
import {colors} from '../res/colors';

export default class CardListExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnTask: this.props.columnTask,
      numTask: this.props.columnTask.rows.length,
    };
  }

  render() {
    return (
      <Card style={styles.cardListTask}>
        <CardItem style={styles.carItemTop}>
          <Left>
            <Text style={styles.titleTop}>{this.state.columnTask.name}</Text>
          </Left>
          <Right>
            <Button transparent>
              <Icon name="ellipsis-vertical" style={styles.iconTop} />
            </Button>
          </Right>
        </CardItem>
        <CardItem style={styles.carItemBody}>
        {this.props.component}
        </CardItem>
        <CardItem style={styles.carItemBottom}>
          <Body>
            <Button transparent style={{alignSelf: 'center'}}>
              <Icon name="add" style={styles.iconBottom} />
              <Text style={styles.titleBottom}>Add Task</Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  titleTop: {
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  iconTop: {
    color: 'white',
    fontSize: 16,
  },

  titleBottom: {
    color: colors.Primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconBottom: {
    color: colors.Primary,
    fontSize: 20,
    margin: 10,
  },

  cardListTask: {
    width: 310,
    backgroundColor: colors.listTaskBackground,
    borderRadius: 8,
  },
  carItemTop: {
    backgroundColor: colors.Primary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  carItemBottom: {
    backgroundColor: colors.listTaskBackground,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  carItemBody: {
    backgroundColor: colors.listTaskBackground,
  },
});
