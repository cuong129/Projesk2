import React, { Component } from 'react';
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
  Title,
  Item,
  Input,
  ListItem,
  CheckBox,
} from 'native-base';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  LogBox,
  Platform
} from 'react-native';
import { colors, ColorBoard } from '../res/colors';
import ChecklistItem from '../components/ChecklistItem';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from "react-native-raw-bottom-sheet";

import TagItem from '../components/TagItem';
import TagColorBoard from '../components/TagColorBoard'
export default class UpdateTaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrChecklist: [],
      ChecklistName: '',
      date: new Date(),
      mode: 'date',
      show: false,
      time: new Date(),
      hasDateSelected: false,
      arrTaglist: [],
      TagName: '',
      selectedColor: 3,
      selectedColorItem: 3,
      selectedIDTagItem: '',
    }
  }
  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }
  handleAddChecklistItem = () => {
    this.setState({
      arrChecklist: [...this.state.arrChecklist, { id: uuidv4(), isChecked: false, name: this.state.ChecklistName }],
      ChecklistName: '',
    });
  }
  handleEditChecklistItem = (id, text) => {
    const newArr = [...this.state.arrChecklist];
    const index = newArr.findIndex(item => item.id === id);
    newArr[index] = Object.assign(newArr[index], { name: text });
    this.setState({ arrChecklist: newArr });
  }
  handleDeleteChecklistItem = (id) => {
    this.setState({
      arrChecklist: this.state.arrChecklist.filter(item => item.id !== id)
    });
  }
  handlePressCheckbox = (id) => {
    const newArr = [...this.state.arrChecklist];
    const index = newArr.findIndex(item => item.id === id);
    newArr[index] = Object.assign(newArr[index], { isChecked: !newArr[index].isChecked });
    this.setState({ arrChecklist: newArr });
  }
  //Date time picker
  onChange = (event, selectedValue) => {
    this.setState({ show: Platform.OS === 'ios' });
    if (this.state.mode === 'date') {
      const currentDate = selectedValue || new Date();
      if (event.type == "set") {
        this.setState({ date: currentDate, mode: 'time', show: Platform.OS !== 'ios', hasDateSelected: true });
      }
      // to show the picker again in time mode
    } else {
      const selectedTime = selectedValue || new Date();
      var newDate = this.state.date
      newDate.setHours(selectedTime.getHours())
      newDate.setMinutes(selectedTime.getMinutes())
      if (event.type == "set") {
        this.setState({ time: selectedTime, date: newDate, mode: 'date', show: Platform.OS === 'ios' });
      }
    }
  };

  showDatepicker = () => {
    this.setState({ show: true, mode: 'date' });
  };
  formatDate = (date, time) => {
    var hour = time.getHours()
    var minute = time.getMinutes()
    if (hour < 10)
      hour = '0' + hour
    if (minute < 10)
      minute = '0' + minute
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ` + hour + ':' + minute;
  }

  renderDateBtn() {
    if (this.state.hasDateSelected)
      return this.formatDate(this.state.date, this.state.time)
    return "Due Date"
  }

  handleAddTagItem = () => {
    this.setState({
      arrTaglist: [...this.state.arrTaglist, { id: uuidv4(), name: this.state.TagName, colorIndex: this.state.selectedColor }],
      TagName: '',
    });
  }

  handlePressColor = (colorIndex) => {
    this.setState({ selectedColor: colorIndex })
    this.RBSheet.close();
  }
  handleDeleteTagItem = (id) => {
    this.setState({
      arrTaglist: this.state.arrTaglist.filter(item => item.id !== id)
    });
  }
  handleEditTagItem = (id, text) => {
    const newArr = [...this.state.arrTaglist];
    const index = newArr.findIndex(item => item.id === id);
    newArr[index] = Object.assign(newArr[index], { name: text });
    this.setState({ arrTaglist: newArr });
  }
  handleOpenColorBoard = (id, colorIndex) => {
    this.setState({ selectedIDTagItem: id, selectedColorItem: colorIndex })
    this.RBSheetItem.open();
  }
  handlePressColorItem = (colorIndex) => {
    const newArr = [...this.state.arrTaglist];
    const index = newArr.findIndex(item => item.id === this.state.selectedIDTagItem);
    newArr[index] = Object.assign(newArr[index], { colorIndex: colorIndex })
    this.setState({ arrTaglist: newArr })
    this.RBSheetItem.close();
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>Task name</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="ellipsis-vertical" />
            </Button>
          </Right>
        </Header>
        <Content>
          {this.state.show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={this.state.date}
              mode={this.state.mode}
              is24Hour={true}
              display="spinner"
              onChange={this.onChange}
            />
          )}
          <Item style={styles.titleItem}>
            <Input
              placeholder="Task Name"
              style={{ fontSize: 24 }} />
          </Item>
          <Item style={styles.item}>
            <Input multiline placeholder="Add card description" />
          </Item>
          <Item>
            <TouchableOpacity style={styles.button}>
              <Icon active name="person-outline" type="Ionicons" style={{ color: colors.DarkPrimary }} />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Assign</Text>
            </TouchableOpacity>
          </Item>
          <Item>
            <TouchableOpacity style={styles.button} onPress={this.showDatepicker}>
              <Icon active name="clock" type="Feather" style={{ color: colors.Danger }} />
              <Text style={{ marginLeft: 10, fontSize: 16, flex: 1 }}>{this.renderDateBtn()}</Text>
              {this.state.hasDateSelected &&
                <TouchableOpacity onPress={() => this.setState({ hasDateSelected: false, date: new Date(), time: new Date() })}>
                  <Icon active name="calendar-remove" type='MaterialCommunityIcons' style={{ color: colors.Danger }} />
                </TouchableOpacity>
              }
            </TouchableOpacity>
          </Item>
          <Text style={styles.title}>Tag</Text>
          <FlatList
            data={this.state.arrTaglist}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TagItem
                item={item}
                onDeletePress={this.handleDeleteTagItem}
                onEditTextChange={this.handleEditTagItem}
                onOpen={this.handleOpenColorBoard} />
            )}
          />
          <Item style={styles.item}>
            <TouchableOpacity onPress={this.handleAddTagItem}>
              <Icon active name="plus" type='Feather' style={{ color: colors.Primary }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.RBSheet.open()}>
              <Icon active name="color-fill" type='Ionicons' style={{ color: ColorBoard[this.state.selectedColor], fontSize: 20 }} />
            </TouchableOpacity>
            <Input
              style={[styles.tagInput, { backgroundColor: ColorBoard[this.state.selectedColor] }]}
              placeholder="Add tag name"
              placeholderTextColor="#fff"
              onChangeText={(text) => { this.setState({ TagName: text }) }}
              value={this.state.TagName} />
            <TouchableOpacity onPress={() => this.setState({ arrTaglist: [] })}>
              <Icon active name="delete-sweep-outline" type='MaterialCommunityIcons' style={{ color: colors.Danger }} />
            </TouchableOpacity>
          </Item>
          <RBSheet
            ref={ref => {this.RBSheet = ref;}}
            height={250}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center"
              }
            }}>
            <Text style={{ fontSize: 16, marginVertical: 10, fontWeight: 'bold' }}>Select a color</Text>
            <TagColorBoard selectedColor={this.state.selectedColor} onPressColor={this.handlePressColor} />
          </RBSheet>
          <RBSheet
            ref={ref => {this.RBSheetItem = ref;}}
            height={250}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center"
              }
            }}>
            <Text style={{ fontSize: 16, marginVertical: 10, fontWeight: 'bold' }}>Select a color</Text>
            <TagColorBoard selectedColor={this.state.selectedColorItem} onPressColor={this.handlePressColorItem} />
          </RBSheet>
          <Text style={styles.title}>Checklist</Text>
          <FlatList
            data={this.state.arrChecklist}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ChecklistItem
                item={item}
                onEditTextChange={this.handleEditChecklistItem}
                onDeletePress={this.handleDeleteChecklistItem}
                onCheckboxPress={this.handlePressCheckbox}
              />
            )}
          />
          <Item style={styles.item}>
            <TouchableOpacity onPress={this.handleAddChecklistItem}>
              <Icon active name="plus" type='Feather' style={{ color: colors.Primary }} />
            </TouchableOpacity>
            <Input
              placeholder="Add checklist item"
              onChangeText={(text) => { this.setState({ ChecklistName: text }) }}
              value={this.state.ChecklistName} />
            <TouchableOpacity onPress={() => this.setState({ arrChecklist: [] })}>
              <Icon active name="delete-sweep-outline" type='MaterialCommunityIcons' style={{ color: colors.Danger }} />
            </TouchableOpacity>
          </Item>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listTaskBackground,
  },
  titleItem: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#fff",
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 15,
    color: colors.Primary,
  },
  tagInput: {
    color: '#fff',
    borderRadius: 10,
    paddingLeft: 15,
    marginRight: 10,
    height: 40,
    marginVertical: 10,
    fontSize: 16,
  }
})