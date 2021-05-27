import React, {Component} from 'react';
import {Icon, Text} from 'native-base';
import {FlatList, StyleSheet, View, ScrollView, Alert} from 'react-native';
import {colors} from '../res/colors';
import {AddTaskAlert, typeAlert, ListTaskAlert} from '../components/AlertCustom/index';
import OptionsMenu from 'react-native-options-menu';
import {firestore} from '../firebase';

export default class ListTaskItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: typeAlert.NONE,
    };
  }

  showAlert() {
    switch (this.state.alert) {
      case typeAlert.ADD_TASK:
        return <AddTaskAlert screen={this} />;
      case typeAlert.EDIT_LIST:
        return <ListTaskAlert screen={this} type={typeAlert.EDIT_LIST} />;
      default:
      // code block
    }
  }

  deleteList = () => {
    Alert.alert(
      'Warning',
      'Are you sure delete list ' + this.props.columnTask.name,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            const newTasks =[...this.props.tasks]
            newTasks.splice(this.props.index, 1);

            firestore()
              .collection('Projects')
              .doc(this.props.idProject)
              .update({
                tasks: newTasks,
              });
          },
        },
      ],
    );
  };

  editList = () => {
    this.setState({alert: typeAlert.EDIT_LIST})
  };

  render() {
    const {columnTask, component} = this.props;

    return (
      <View style={styles.cardListTask}>
        {this.showAlert()}
        <View backgroundColor={columnTask.color} style={styles.cardItemTop}>
          <Text style={styles.titleTop}>{columnTask.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="add-outline"
              style={styles.iconTop}
              onPress={() => this.setState({alert: typeAlert.ADD_TASK})}
            />
            <OptionsMenu
              customButton={
                <Icon name="ellipsis-vertical" style={styles.iconTop} />
              }
              destructiveIndex={1}
              options={['Edit','Delete']}
              actions={[this.editList, this.deleteList]}
            />
          </View>
        </View>
        <View style={styles.carItemBody}>{component}</View>
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
