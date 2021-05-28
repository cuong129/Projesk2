import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Text,
  Button,
  StyleProvider,
  Icon,
  Item,
  Input,
  Fab,
  Right,
  Left,
  Body,
  ListItem,
  Thumbnail,
} from 'native-base';

import {
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../res/colors';
import TaskItem from '../components/TaskItem';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import {ProjectAlert, typeAlert} from '../components/AlertCustom/index';
import {auth, firestore} from '../firebase';
import SearchBar from '../components/SearchBar';

export default class MyProjectScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      myTasks: [],
    };
    this.currentUser = auth().currentUser;
  }

  componentDidMount() {
    this.setState({loading: true});
    this.subscriber = firestore()
      .collection('Users')
      .doc(this.currentUser.uid)
      .onSnapshot(querySnapshot => {
        const projects = [];
        const MyProjectIds = querySnapshot.get('myProjects');
        this.getAllInfoProject(MyProjectIds, 0, projects);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  componentWillUnmount() {
    this.subscriber();
  }

  getAllInfoProject(MyProjectIds, index, projects) {
    if (!MyProjectIds) {
      this.getMyTask(projects);
      return;
    }
    if (index == MyProjectIds.length) {
      this.getMyTask(projects);
      return;
    }
    firestore()
      .collection('Projects')
      .doc(MyProjectIds[index])
      .get()
      .then(result => {
        if (result.exists) {
          project = {
            id: result.id,
            ...result.data(),
          };
          projects.push(project);
        }
      })
      .finally(() => {
        this.getAllInfoProject(MyProjectIds, index + 1, projects);
      });
  }

  getMyTask(projects) {
    let myTasks = [];
    let newMyTask = {};
    projects.forEach(eProject => {
      newMyTask = {
        id: eProject.id,
        name: eProject.name,
        photoURL: eProject.photoURL,
        tasks: [],
      };
      eProject.tasks.forEach((eTask, columnIndex) => {
        eTask.rows.forEach((eRow, index) => {
          const found = eRow.assigns.find(
            eAssign => eAssign.uid == this.currentUser.uid,
          );
          if (found) {
            let newTask = {
              columnIndex: columnIndex,
              index: index,
              task: eRow,
              id: newMyTask.tasks.length,
            };
            newMyTask.tasks.push(newTask);
          }
        });
      });

      if (newMyTask.tasks.length != 0) myTasks.push(newMyTask);
    });

    this.setState({myTasks: myTasks, loading: false});
  }

  render() {
    const {navigation} = this.props;
    const {myTasks} = this.state;

    const componentBody = () => {
      if (this.state.loading)
        return (
          <View style={styles.containerView}>
            <ActivityIndicator color={colors.Primary} size="large" />
          </View>
        );
      if (this.state.myTasks.length == 0)
        return (
          <View style={styles.containerView}>
            <Icon name="checkmark-done-circle" style={styles.iconEmpty} />
            <Text note>You have no tasks</Text>
          </View>
        );
      return (
        <FlatList
          data={myTasks}
          renderItem={({item}) => {
            const url = item.photoURL;
            const source =
              url == null || url === ''
                ? require('../res/images/ic_app.png')
                : {uri: url};
            const resizeMode = url == null || url === '' ? 'center' : 'cover';
            const idProject = item.id

            return (
              <View>
                <View style={styles.headerList}>
                  <Thumbnail
                    square
                    source={source}
                    style={{
                      backgroundColor: colors.Primary,
                      resizeMode: resizeMode,
                      marginHorizontal: 20,
                      marginVertical: 10,
                    }}
                  />
                  <Text>{item.name}</Text>
                </View>
                <FlatList
                  data={item.tasks}
                  style={{paddingVertical: 5}}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        style={styles.cardTask}
                        onPress={() =>
                          navigation.navigate('Project', {
                            screen: 'Task',
                            params: {
                              idProject: idProject,
                              columnIndex: item.columnIndex,
                              index: item.index,
                            },
                          })
                        }>
                        <TaskItem item={item.task} />
                      </TouchableOpacity>
                    );
                  }}
                  scrollEnabled={false}
                  keyExtractor={item => item.id}
                />
              </View>
            );
          }}
          keyExtractor={item => item.id}
        />
      );
    };

    return (
      <Container style={{backgroundColor: colors.Background}}>
        <Header style={{backgroundColor: 'white'}}>
          <SearchBar style={styles.searchBar} />
          <Right>
            <Button transparent>
              <Icon name="filter" type="Foundation" style={{color: 'black'}} />
            </Button>
          </Right>
        </Header>
        <FocusAwareStatusBar backgroundColor="white" barStyle="dark-content" />
        {componentBody()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  titleView: {
    backgroundColor: '#FFF',
    elevation: 0.5,
  },
  titleText: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    fontSize: 20,
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
  searchBar: {
    width: '85%',
    alignSelf: 'center',
    paddingLeft: 5,
  },
  headerList: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    elevation: 4,
  },
  cardTask: {
    width: '70%',
    alignSelf: 'center',
  },
});
