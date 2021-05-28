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
  Title,
  Item,
  Input,
  ListItem,
  CheckBox,
  StyleProvider,
  Thumbnail,
  Text,
} from 'native-base';
import {
  FlatList,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  LogBox,
  Platform,
  StatusBar,
  ActivityIndicatorComponent,
  Image,
  Keyboard,
} from 'react-native';
import {colors, ColorBoard} from '../res/colors';
import ChecklistItem from '../components/ChecklistItem';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import TagItem from '../components/TagItem';
import TagColorBoard from '../components/TagColorBoard';
import {
  auth,
  firestore,
  addDeadlineNoti,
  addAssignNoti,
  deleteAssignNoti,
  deleteDeadlineNoti,
  addActivity,
  typeActivity,
} from '../firebase';
import {typeAlert, AssignAlert} from '../components/AlertCustom';
import FormatPeriodTime from '../utility/FormatPeriodTime';

export default class TaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: '',
      taskNote: '',
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
      completeBtn: 'COMPLETE',
      completeDetail: 'This task is active',
      tasks: [{rows: [{name: ''}]}],
      alert: typeAlert.NONE,
      arrAssign: [],
      members: [],
      oldArrAssign: [],
      arrComment: [],
    };
    this.currentUser = auth().currentUser;
  }
  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const {idProject, columnIndex, index} = this.props.route.params;
    firestore()
      .collection('Projects')
      .doc(idProject)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) return;
        const data = documentSnapshot.data();
        this.setState({tasks: data.tasks, members: data.members});
        this.initValue();
      });
  }
  initValue() {
    const {columnIndex, index} = this.props.route.params;
    const task = this.state.tasks[columnIndex].rows[index];

    let newArrComment = [];
    if (task.comments) {
      newArrComment = [...task.comments];
      newArrComment.sort((firstEl, secondEl) => {
        return secondEl.time - firstEl.time;
      });
    }
    let newArrAssigns = [];
    if (task.assigns) newArrAssigns = [...task.assigns];

    this.setState({
      taskName: task.name,
      taskNote: task.note,
      arrAssign: newArrAssigns,
      oldArrAssign: newArrAssigns,
      arrComment: newArrComment,
    });
    if (task.checklist != null) this.setState({arrChecklist: task.checklist});
    if (task.tag != null) this.setState({arrTaglist: task.tag});
    if (task.DueDate != null) {
      this.setState({
        date: new Date(task.DueDate.toDate()),
        time: new Date(task.DueDate.toDate()),
        hasDateSelected: true,
      });
    }
    if (task.complete != null) {
      const {hasCompleted, date, user} = task.complete;
      if (hasCompleted) {
        const dateCompleted = new Date(date.toDate());
        this.setState({
          completeBtn: 'RESTORE',
          completeDetail:
            'Completed by\n' + user + '\n' + this.formatDate(dateCompleted),
        });
      }
    }
  }

  handleAddChecklistItem = () => {
    this.setState({
      arrChecklist: [
        ...this.state.arrChecklist,
        {id: uuidv4(), hasChecked: false, name: this.state.ChecklistName},
      ],
      ChecklistName: '',
    });
  };
  handleEditChecklistItem = (id, text) => {
    const newArr = [...this.state.arrChecklist];
    const index = newArr.findIndex(item => item.id === id);
    newArr[index] = Object.assign(newArr[index], {name: text});
    this.setState({arrChecklist: newArr});
  };
  handleDeleteChecklistItem = id => {
    this.setState({
      arrChecklist: this.state.arrChecklist.filter(item => item.id !== id),
    });
  };
  handlePressCheckbox = id => {
    const newArr = [...this.state.arrChecklist];
    const index = newArr.findIndex(item => item.id === id);
    newArr[index] = Object.assign(newArr[index], {
      hasChecked: !newArr[index].hasChecked,
    });
    this.setState({arrChecklist: newArr});
  };
  //Date time picker
  onChange = (event, selectedValue) => {
    this.setState({show: Platform.OS === 'ios'});
    if (this.state.mode === 'date') {
      const currentDate = selectedValue || new Date();
      if (event.type == 'set') {
        this.setState({
          date: currentDate,
          mode: 'time',
          show: Platform.OS !== 'ios',
          hasDateSelected: true,
        });
      }
      // to show the picker again in time mode
    } else {
      const selectedTime = selectedValue || new Date();
      var newDate = this.state.date;
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      if (event.type == 'set') {
        this.setState({
          time: selectedTime,
          date: newDate,
          mode: 'date',
          show: Platform.OS === 'ios',
        });
      }
    }
  };

  showDatepicker = () => {
    this.setState({show: true, mode: 'date'});
  };
  formatDate = date => {
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
  };

  renderDateBtn() {
    if (this.state.hasDateSelected) return this.formatDate(this.state.date);
    return 'Due Date';
  }

  handleAddTagItem = () => {
    this.setState({
      arrTaglist: [
        ...this.state.arrTaglist,
        {
          id: uuidv4(),
          name: this.state.TagName,
          colorIndex: this.state.selectedColor,
        },
      ],
      TagName: '',
    });
  };

  handlePressColor = colorIndex => {
    this.setState({selectedColor: colorIndex});
    this.RBSheet.close();
  };
  handleDeleteTagItem = id => {
    this.setState({
      arrTaglist: this.state.arrTaglist.filter(item => item.id !== id),
    });
  };
  handleEditTagItem = (id, text) => {
    const newArr = [...this.state.arrTaglist];
    const index = newArr.findIndex(item => item.id === id);
    newArr[index] = Object.assign(newArr[index], {name: text});
    this.setState({arrTaglist: newArr});
  };
  handleOpenColorBoard = (id, colorIndex) => {
    this.setState({selectedIDTagItem: id, selectedColorItem: colorIndex});
    this.RBSheetItem.open();
  };
  handlePressColorItem = colorIndex => {
    const newArr = [...this.state.arrTaglist];
    const index = newArr.findIndex(
      item => item.id === this.state.selectedIDTagItem,
    );
    newArr[index] = Object.assign(newArr[index], {colorIndex: colorIndex});
    this.setState({arrTaglist: newArr});
    this.RBSheetItem.close();
  };
  UpdateTasks(tasks) {
    firestore()
      .collection('Projects')
      .doc(this.props.route.params.idProject)
      .update({
        tasks: tasks,
      });
  }
  handleUpdateTask = () => {
    const {idProject, columnIndex, index} = this.props.route.params;
    const {
      tasks,
      taskName,
      taskNote,
      arrChecklist,
      arrTaglist,
      date,
      hasDateSelected,
      arrAssign,
      oldArrAssign,
    } = this.state;
    var newTasks = tasks;
    let task = newTasks[columnIndex].rows[index];
    //add activity before update
    this.addActivityUpdateTask(task, idProject);

    task.name = taskName;
    task.note = taskNote;
    task.tag = arrTaglist.length > 0 ? arrTaglist : null;
    task.checklist = arrChecklist.length > 0 ? arrChecklist : null;
    task.DueDate = hasDateSelected ? firestore.Timestamp.fromDate(date) : null;
    task.assigns = arrAssign;

    //update deadline noti if due date has changed

    //get list of changed Assign
    const oldArr = [...oldArrAssign];
    const newArr = [...arrAssign];
    if (oldArr.length > 0 && newArr.length > 0) {
      var i = 0;
      do {
        var isChanged = true;
        for (var j = 0; j < newArr.length; j++)
          if (oldArr[i].uid === newArr[j].uid) {
            oldArr.splice(i, 1);
            newArr.splice(j, 1);
            isChanged = false;
            break;
          }
        if (isChanged) i++;
      } while (i < oldArr.length);
    }
    if (oldArr.length > 0 && newArr.length === 0) {
      //delete assign and deadline noti of old Assign who has been unassigned
      oldArr.forEach(user => {
        deleteAssignNoti(user.uid, idProject, columnIndex, index);
        //deleteDeadlineNoti(user.uid, idProject, columnIndex, index);
      });
    }
    arrAssign.forEach(user => {
      addAssignNoti(
        newArr,
        user.uid,
        this.currentUser,
        idProject,
        columnIndex,
        index,
        date,
        hasDateSelected,
      );
    });
    this.UpdateTasks(newTasks);
    this.props.navigation.goBack();
  };

  handleDeleteTask = () => {
    const {columnIndex, index, idProject} = this.props.route.params;
    var newTasks = this.state.tasks;

    //add activity
    let content =
      this.currentUser.displayName +
      ' delete task ' +
      newTasks[columnIndex].rows[index].name;
    addActivity(content, typeActivity.DELETE_TASK, idProject);

    newTasks[columnIndex].rows.splice(index, 1);
    this.UpdateTasks(newTasks);
    this.props.navigation.goBack();
  };

  handlePressComplete = () => {
    const {columnIndex, index, idProject} = this.props.route.params;
    var newTasks = this.state.tasks;
    if (this.state.completeBtn === 'COMPLETE') {
      var date = new Date();
      var detail =
        'Completed by\n' +
        this.currentUser.displayName +
        '\n' +
        this.formatDate(date);
      this.setState({
        completeDetail: detail,
        completeBtn: 'RESTORE',
      });
      newTasks[columnIndex].rows[index].complete = {
        hasCompleted: true,
        user: this.currentUser.displayName,
        date: firestore.Timestamp.fromDate(date),
      };

      //add activity
      let content =
        this.currentUser.displayName +
        ' complete task ' +
        newTasks[columnIndex].rows[index].name;
      addActivity(content, typeActivity.COMPLETE_TASK, idProject);
    } else {
      this.setState({
        completeDetail: 'This task is active',
        completeBtn: 'COMPLETE',
      });
      newTasks[columnIndex].rows[index].complete = {
        hasCompleted: false,
        user: null,
        date: null,
      };
      //add activity
      let content =
        this.currentUser.displayName +
        ' restore task ' +
        newTasks[columnIndex].rows[index].name;
      addActivity(content, typeActivity.RESTORE_TASK, idProject);
    }
    this.UpdateTasks(newTasks);
  };

  render() {
    const {arrAssign, arrComment} = this.state;
    const showAlert = () => {
      if (this.state.alert == typeAlert.ASSIGN)
        return <AssignAlert screen={this} />;
    };

    const renderAssignBtn = () => {
      if (arrAssign.length == 0)
        return <Text style={{marginLeft: 10, fontSize: 16}}>Assign</Text>;
      return (
        <FlatList
          horizontal
          data={arrAssign}
          renderItem={({item}) => (
            <Image style={styles.imageCircle} source={{uri: item.photoURL}} />
          )}
          keyExtractor={item => item.uid}
        />
      );
    };

    return (
      <StyleProvider style={getTheme(material)}>
        <Container style={styles.container}>
          <StatusBar translucent={false} />
          <Header style={{backgroundColor: colors.Primary}}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="close" />
              </Button>
            </Left>
            <Body>
              <Title>Task detail</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.handleDeleteTask}>
                <Icon
                  name="delete"
                  type="MaterialCommunityIcons"
                  style={{color: colors.Danger}}
                />
              </Button>
              <Button transparent onPress={this.handleUpdateTask}>
                <Icon name="check" type="Feather" />
              </Button>
            </Right>
          </Header>
          <Content>
            {this.state.show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={this.state.date}
                mode={this.state.mode}
                minimumDate={new Date()}
                is24Hour={true}
                display="spinner"
                onChange={this.onChange}
              />
            )}
            <Item style={styles.completeTitle}>
              {this.state.completeBtn === 'RESTORE' && (
                <Icon
                  name="checkmark-circle-sharp"
                  type="Ionicons"
                  style={{color: colors.Positive}}
                />
              )}
              <Text style={{fontSize: 16, color: 'gray', flex: 1}}>
                {this.state.completeDetail}
              </Text>
              <TouchableOpacity onPress={this.handlePressComplete}>
                <Text
                  style={{
                    color:
                      this.state.completeBtn === 'COMPLETE'
                        ? colors.Positive
                        : 'gray',
                    fontWeight: 'bold',
                  }}>
                  {this.state.completeBtn}
                </Text>
              </TouchableOpacity>
            </Item>
            <Item style={styles.titleItem}>
              <Input
                value={this.state.taskName}
                placeholder="Add task name"
                onChangeText={text => this.setState({taskName: text})}
                style={{fontSize: 22}}
              />
            </Item>
            <Item style={styles.item}>
              <Input
                multiline
                value={this.state.taskNote}
                placeholder="Add card description"
                onChangeText={text => this.setState({taskNote: text})}
              />
            </Item>
            <Item>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.setState({alert: typeAlert.ASSIGN})}>
                <Icon
                  active
                  name="person-outline"
                  type="Ionicons"
                  style={{color: colors.DarkPrimary}}
                />
                {renderAssignBtn()}
              </TouchableOpacity>
            </Item>
            <Item style={{marginBottom: 10}}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.showDatepicker}>
                <Icon
                  active
                  name="clock"
                  type="Feather"
                  style={{color: colors.Danger}}
                />
                <Text style={{marginLeft: 10, fontSize: 16, flex: 1}}>
                  {this.renderDateBtn()}
                </Text>
                {this.state.hasDateSelected && (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        hasDateSelected: false,
                        date: new Date(),
                        time: new Date(),
                      })
                    }>
                    <Icon
                      active
                      name="calendar-remove"
                      type="MaterialCommunityIcons"
                      style={{color: colors.Danger}}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </Item>
            <Text style={styles.title}>Tag</Text>
            <FlatList
              data={this.state.arrTaglist}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TagItem
                  item={item}
                  onDeletePress={this.handleDeleteTagItem}
                  onEditTextChange={this.handleEditTagItem}
                  onOpen={this.handleOpenColorBoard}
                />
              )}
            />
            <Item style={styles.item}>
              <TouchableOpacity onPress={this.handleAddTagItem}>
                <Icon
                  active
                  name="plus"
                  type="Feather"
                  style={{color: colors.Primary}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.RBSheet.open()}>
                <Icon
                  active
                  name="color-fill"
                  type="Ionicons"
                  style={{
                    color: ColorBoard[this.state.selectedColor],
                    fontSize: 20,
                  }}
                />
              </TouchableOpacity>
              <Input
                style={[
                  styles.tagInput,
                  {backgroundColor: ColorBoard[this.state.selectedColor]},
                ]}
                placeholder="Add tag name"
                placeholderTextColor="#fff"
                onChangeText={text => {
                  this.setState({TagName: text});
                }}
                value={this.state.TagName}
              />
              <TouchableOpacity onPress={() => this.setState({arrTaglist: []})}>
                <Icon
                  active
                  name="delete-sweep-outline"
                  type="MaterialCommunityIcons"
                  style={{color: colors.Danger}}
                />
              </TouchableOpacity>
            </Item>
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={250}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              }}>
              <Text
                style={{fontSize: 16, marginVertical: 10, fontWeight: 'bold'}}>
                Select a color
              </Text>
              <TagColorBoard
                selectedColor={this.state.selectedColor}
                onPressColor={this.handlePressColor}
              />
            </RBSheet>
            <RBSheet
              ref={ref => {
                this.RBSheetItem = ref;
              }}
              height={250}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              }}>
              <Text
                style={{fontSize: 16, marginVertical: 10, fontWeight: 'bold'}}>
                Select a color
              </Text>
              <TagColorBoard
                selectedColor={this.state.selectedColorItem}
                onPressColor={this.handlePressColorItem}
              />
            </RBSheet>
            <Text style={styles.title}>Checklist</Text>
            <FlatList
              data={this.state.arrChecklist}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
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
                <Icon
                  active
                  name="plus"
                  type="Feather"
                  style={{color: colors.Primary}}
                />
              </TouchableOpacity>
              <Input
                placeholder="Add checklist item"
                onChangeText={text => {
                  this.setState({ChecklistName: text});
                }}
                value={this.state.ChecklistName}
              />
              <TouchableOpacity
                onPress={() => this.setState({arrChecklist: []})}>
                <Icon
                  active
                  name="delete-sweep-outline"
                  type="MaterialCommunityIcons"
                  style={{color: colors.Danger}}
                />
              </TouchableOpacity>
            </Item>

            {/* comment */}
            <View style={{backgroundColor: 'white'}}>
              <Text style={styles.title}>Conversations</Text>
              <Item style={{paddingHorizontal: 10}}>
                <Input
                  placeholder="Add Comment"
                  onChangeText={text => (this.content = text)}
                  value={this.content}
                />
                <Icon
                  active
                  name="send-sharp"
                  style={{color: colors.Primary}}
                  onPress={() => this.sendComment()}
                />
              </Item>
              <FlatList
                data={arrComment}
                keyExtractor={(item, index) => index}
                renderItem={({item, index}) =>
                  this.renderItemCommand(item, index)
                }
              />
            </View>
          </Content>
          {showAlert()}
        </Container>
      </StyleProvider>
    );
  }

  renderItemCommand(item, index) {
    const icon = this.getIcon(item);
    return (
      <ListItem avatar noBorder>
        <Left>
          <Thumbnail source={{uri: item.photoURL}} small />
        </Left>
        <Body>
          <View style={styles.commentHeader}>
            <View>
              <Text note>{FormatPeriodTime(item.time)}</Text>
              <Text>{item.name}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name={icon.name}
                type={icon.type}
                style={icon.style}
                onPress={() => {
                  icon.delete ? this.deleteComment(index) : null;
                }}
              />
            </View>
          </View>
          <Text style={styles.contentComment}>{item.content}</Text>
        </Body>
        <Right></Right>
      </ListItem>
    );
  }

  getIcon(item) {
    if (item.uid == this.currentUser.uid)
      return {
        name: 'chat-remove-outline',
        type: 'MaterialCommunityIcons',
        style: {color: colors.Danger, fontSize: 25},
        delete: true,
      };

    return {
      name: 'insert-emoticon',
      type: 'MaterialIcons',
      style: {color: '#01A5F4', marginRight: 20, fontSize: 25},
      delete: false,
    };
  }

  sendComment() {
    if (!this.content || this.content.trim() == '') return;
    const newComment = {
      uid: this.currentUser.uid,
      name: this.currentUser.displayName,
      photoURL: this.currentUser.photoURL,
      time: Date.now(),
      content: this.content,
    };

    const newArrComment = [...this.state.arrComment];
    newArrComment.unshift(newComment);
    this.content = '';
    Keyboard.dismiss();
    this.updateCommand(newArrComment);
  }

  deleteComment(index) {
    const newArrComment = [...this.state.arrComment];
    newArrComment.splice(index, 1);
    this.updateCommand(newArrComment);
  }

  updateCommand(newArrComment) {
    const {columnIndex, index} = this.props.route.params;
    let newTasks = this.state.tasks;

    newTasks[columnIndex].rows[index].comments = newArrComment;
    this.UpdateTasks(newTasks);
    this.setState({arrComment: newArrComment});
  }

  addActivityUpdateTask(task, idProject) {
    const {
      taskName,
      taskNote,
      arrChecklist,
      arrTaglist,
      date,
      arrAssign,
    } = this.state;

    let content = '';
    if (task.name != taskName)
      content += '\nRename task from ' + task.name + ' to ' + taskName + '.';
    if (task.note != taskNote)
      content += '\nChange note from ' + task.note + ' to ' + taskNote + '.';
    if (JSON.stringify(task.assigns) !== JSON.stringify(arrAssign)) {
      content += '\nAssign task for ';
      if (arrAssign.length == 0) content += 'no one';
      else
        arrAssign.forEach((e, index) => {
          if (index == arrAssign.length - 1) content += e.name + '.';
          else content += e.name + ', ';
        });
    }
    const fromTime = this.formatDate(new Date(task.DueDate.toDate()));
    const toTime = this.formatDate(date);
    if (fromTime != toTime) {
      content += '\nChange due date from ' + fromTime + ' to ' + toTime + '.';
    }
    if (JSON.stringify(task.tag) !== JSON.stringify(arrTaglist)) {
      if (!task.tag && arrTaglist.length == 0);
      else content += '\nEdit list tag.';
    }
    if (JSON.stringify(task.checklist) !== JSON.stringify(arrChecklist)) {
      if (!task.checklist && arrChecklist.length == 0);
      else content += '\nEdit checklist.';
    }

    if (content === '') return;
    content =
      this.currentUser.displayName +
      ' edit detail task ' +
      task.name +
      ':' +
      content;

    addActivity(content, typeActivity.EDIT_TASK, idProject);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listTaskBackground,
  },
  completeTitle: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 25,
  },
  titleItem: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#fff',
    color: colors.Primary,
  },
  tagInput: {
    color: '#fff',
    borderRadius: 10,
    paddingLeft: 15,
    marginRight: 10,
    height: 46,
    marginVertical: 10,
    fontSize: 16,
  },
  imageCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 8,
  },
  contentComment: {
    backgroundColor: '#E4E6EB',
    color: '#494949',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
});
