import React, {Component} from 'react';
import {Icon} from 'native-base';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import {colors} from '../res/colors';
import {AddTaskAlert} from '../components/AlertCustom/index';

export default class CardListExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnTask: this.props.columnTask,
      numTask: this.props.columnTask.rows.length,
      showAlert: false,
    };
  }

  render() {
    return (
      <View style={styles.cardListTask}>
        {/* <AddTaskAlert screen={this} /> */}
        <View
          backgroundColor={this.state.columnTask.color}
          style={styles.cardItemTop}>
          <Text style={styles.titleTop}>{this.state.columnTask.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="add-outline"
              style={styles.iconTop}
              onPress={() => this.setState({showAlert: true})}
            />
            <Icon name="ellipsis-vertical" style={styles.iconTop} />
          </View>
        </View>
        <View style={styles.carItemBody}>{this.props.component}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleTop: {
    marginLeft: 25,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  iconTop: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  cardListTask: {
    width: 310,
    flex: 1,
    backgroundColor: colors.listTaskBackground,
    borderRadius: 8,
    elevation: 10,
  },
  cardItemTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  carItemBody: {
    backgroundColor: colors.listTaskBackground,
    flex: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
