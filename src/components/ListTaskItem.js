import React, {Component} from 'react';
import {Icon, Text} from 'native-base';
import {FlatList, StyleSheet, View, ScrollView, Alert} from 'react-native';
import {colors} from '../res/colors';
import {AddTaskAlert} from '../components/AlertCustom/index';

export default class ListTaskItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
    };
  }

  showAlert() {
    if (this.state.showAlert) return <AddTaskAlert screen={this} />;
  }

  render() {
    const {columnTask, component} = this.props;
    const componentBody = () => {
      if (columnTask.rows.length == 0)
        return (
          <View style={styles.containerView}>
            <Icon name="checkmark-circle" style={styles.iconEmpty} />
            <Text note>You have no tasks</Text>
            <Text note>Tap + to create a new one</Text>
          </View>
        );
      return component;
    };

    return (
      <View style={styles.cardListTask}>
        {this.showAlert()}
        <View backgroundColor={columnTask.color} style={styles.cardItemTop}>
          <Text style={styles.titleTop}>{columnTask.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="add-outline"
              style={styles.iconTop}
              onPress={() => this.setState({showAlert: true})}
            />
            <Icon name="ellipsis-vertical" style={styles.iconTop} />
          </View>
        </View>
        <View style={styles.carItemBody}>{componentBody()}</View>
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
  iconEmpty: {
    fontSize: 50,
    padding: 10,
    color: colors.Disable,
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
