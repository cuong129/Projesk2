import React, {Component, useState} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
} from 'native-base';
import {
  ImageBackground,
  ScrollView,
  Image,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Alert,
  InteractionManager,
} from 'react-native';
import {colors} from '../res/colors';
import ListTaskItem from '../components/ListTaskItem';
import TaskItem from '../components/TaskItem';
import {Board, RowRepository} from '../components/Board/index';
import {
  ListTaskAlert,
  ProjectAlert,
  typeAlert,
} from '../components/AlertCustom/index';
import {auth, firestore, deleteProjectNoti, updateTaskNoti} from '../firebase';
import OptionsMenu from 'react-native-options-menu';
import { interpolateNode } from 'react-native-reanimated';

export default class ProjectScreen extends Component {
  constructor(props) {
    super(props);
    this.idProject = this.props.route.params.idProject;

    this.state = {
      alert: typeAlert.NONE,
      project: {name: ''},
      rowRepository: new RowRepository([]),
      tasks: [],
      source: require('../res/images/ic_app.png'),
      resizeMode: 'center',
      currentMember: {admin: false},
    };

    this.currentUser = auth().currentUser;
  }

  componentDidMount() {
    this.subscriber = firestore()
      .collection('Projects')
      .doc(this.idProject)
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.exists) {
          firestore()
            .collection('Users')
            .doc(this.currentUser.uid)
            .update({
              myProjects: firestore.FieldValue.arrayRemove(this.idProject),
            });
          const navigation = this.props.navigation;
          navigation.popToTop();
          navigation.goBack();
          return;
        }

        const data = querySnapshot.data();
        let indexRow = 0;
        data.tasks.forEach((element, index) => {
          element.id = index;
          element.rows.forEach(elementRow => {
            elementRow.id = indexRow++;
          });
        });

        let found = data.members.find(
          element => element.uid == this.currentUser.uid,
        );
        if (!found) found = {admin: false};

        const url = data.photoURL;
        this.setState({
          project: data,
          rowRepository: new RowRepository(data.tasks),
          source:
            url == null || url === ''
              ? require('../res/images/ic_app.png')
              : {uri: url},
          resizeMode: url == null || url === '' ? 'center' : 'cover',
          currentMember: found,
        });
      });

    // Unsubscribe from events when no longer in use
    return () => this.subscriber();
  }

  componentWillUnmount() {
    this.subscriber();
  }

  AddList() {
    this.setState({alert: typeAlert.ADD_LIST});
  }

  showAlert() {
    switch (this.state.alert) {
      case typeAlert.ADD_LIST:
        return <ListTaskAlert screen={this} type={typeAlert.ADD_LIST} />;
      case typeAlert.EDIT_PROJECT:
        return <ProjectAlert screen={this} type={typeAlert.EDIT_PROJECT} />;
      default:
      // code block
    }
  }

  editProject = () => {
    this.setState({alert: typeAlert.EDIT_PROJECT});
  };

  showMember = () => {
    this.props.navigation.navigate('Member', {
      idProject: this.idProject,
      members: this.state.project.members,
    });
  };

  deleteProject = () => {
    const {currentMember} = this.state;
    const content = currentMember.admin ? 'delete' : 'leave';
    Alert.alert(
      'Warning',
      'Are you sure ' + content + ' project ' + this.state.project.name,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            if (currentMember.admin) {
              //delete all noti of members
              this.state.project.members.forEach(user => deleteProjectNoti(user.uid, this.idProject));
              firestore().collection('Projects').doc(this.idProject).delete();
            }
            else {
              firestore()
                .collection('Users')
                .doc(this.currentUser.uid)
                .update({
                  myProjects: firestore.FieldValue.arrayRemove(this.idProject),
                });

              firestore()
                .collection('Projects')
                .doc(this.idProject)
                .update({
                  members: firestore.FieldValue.arrayRemove(currentMember),
                });
              this.props.navigation.goBack();
            }
          },
        },
      ],
    );
  };

  render() {
    const {
      project,
      rowRepository,
      source,
      resizeMode,
      currentMember,
    } = this.state;
    const {navigation} = this.props;

    return (
      <ImageBackground
        source={source}
        style={{flex: 1}}
        imageStyle={styles.image}
        resizeMode={resizeMode}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: 'transparent'}}>
            <Left>
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{project.name}</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.AddList.bind(this)}>
                <Icon name="add-outline" />
              </Button>
              <OptionsMenu
                customButton={
                  <View style={{justifyContent: 'center', margin: 12}}>
                    <Icon
                      name="ellipsis-vertical"
                      style={{
                        color: 'white',
                        fontSize: 20,
                      }}
                    />
                  </View>
                }
                destructiveIndex={1}
                options={[
                  'Edit Project',
                  'Member',
                  currentMember.admin ? 'Delete Project' : 'Leave Project',
                ]}
                actions={[
                  this.editProject,
                  this.showMember,
                  this.deleteProject,
                ]}
              />
            </Right>
          </Header>
          {this.showAlert()}
          <Board
            contentContainerStyle={styles.containerListTask}
            rowRepository={rowRepository}
            renderRow={this.renderRow.bind(this)}
            renderColumnWrapper={this.renderColumnWrapper.bind(this)}
            renderColumnEmpty={this.renderColumnEmpty.bind(this)}
            open={this.onOpen.bind(this)}
            onDragEnd={this.onDragEnd.bind(this)}
          />
        </Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor="rgba(0, 0, 0, 0.2)"
          translucent
        />
      </ImageBackground>
    );
  }

  renderRow(item) {
    return (
      <View style={styles.cardTask}>
        <TaskItem item={item} />
      </View>
    );
  }

  renderColumnWrapper(column, index, columnComponent) {
    return (
      <View style={styles.itemListTask}>
        <ListTaskItem
          index={index}
          columnTask={column}
          component={columnComponent}
          idProject={this.idProject}
          tasks={this.state.project.tasks}
        />
      </View>
    );
  }

  renderColumnEmpty() {
    return (
      <View style={styles.containerView}>
        <Icon name="checkmark-circle" style={styles.iconEmpty} />
        <Text note>You have no tasks</Text>
        <Text note>Tap + to create a new one</Text>
      </View>
    );
  }

  onOpen(item, columnIndex, index) {
    const {tasks, members} = this.state.project;
    this.props.navigation.navigate('Task', {
      idProject: this.idProject,
      columnIndex: columnIndex,
      index: index,
    });
  }

  onDragEnd(srcColumnId, destColumnId, item) {
    const newData = [...this.state.project.tasks];

    const row = {...item.row()};
    const indexOld = newData[srcColumnId].rows.indexOf(row);
    newData[srcColumnId].rows.splice(indexOld, 1);
    newData[destColumnId].rows.splice(item.index(), 0, row);
   
    //update task noti
    newData[destColumnId].rows[item.index()]
      .assigns.forEach(user => 
        updateTaskNoti(user.uid, this.idProject, srcColumnId, indexOld, destColumnId, item.index()))
    firestore().collection('Projects').doc(this.idProject).update({
      tasks: newData,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingTop: StatusBar.currentHeight - 4,
  },
  image: {
    flex: 1,
    backgroundColor: colors.Primary,
  },
  itemListTask: {
    margin: 10,
    marginBottom: 20,
  },
  containerListTask: {
    paddingHorizontal: 10,
  },
  cardTask: {
    width: 280,
    alignSelf: 'center',
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
