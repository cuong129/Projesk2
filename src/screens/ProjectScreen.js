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
} from 'react-native';
import {colors} from '../res/colors';
import ListTaskItem from '../components/ListTaskItem';
import TaskItem from '../components/TaskItem';
import {Board, RowRepository} from '../components/Board/index';
import {ListTaskAlert} from '../components/AlertCustom/index';
import {auth, firestore} from '../firebase';

export default class ProjectScreen extends Component {
  constructor(props) {
    super(props);

    this.project = this.props.route.params.project;
    this.idProject = this.project.id;

    const data = [
      {
        id: 1,
        name: 'To do',
        color: '#DA3553',
        rows: [
          {id: 1, name: 'Map'},
          {id: 2, name: 'Grid'},
          {id: 4, name: 'me'},
        ],
      },
      {
        id: 2,
        name: 'Done',
        color: '#01A5F4',
        rows: [{id: 3, name: 'Boss'}],
      },
      {
        id: 3,
        name: 'Doing',
        color: '#FFD800',
        rows: [{id: 5, name: 'collision'}],
      },
    ];

    this.state = {
      showAddList: false,
      project: this.project,
      rowRepository: new RowRepository([]),
    };
  }

  componentDidMount() {
    this.subscriber = firestore()
      .collection('Projects')
      .doc(this.idProject)
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.exists) {
          firestore()
            .collection('Users')
            .doc(auth().currentUser.uid)
            .update({
              myProjects: firestore.FieldValue.arrayRemove(this.idProject),
            });
          const navigation = this.props.navigation;
          navigation.popToTop();
          navigation.goBack();
          return;
        }

        const data = querySnapshot.data();
        data.tasks.forEach((element, index) => {
          element.id = index;
        });
        this.setState({
          project: data,
          rowRepository: new RowRepository(data.tasks),
        });
      });

    // Unsubscribe from events when no longer in use
    return () => this.subscriber();
  }

  componentWillUnmount() {
    this.subscriber();
  }

  AddList = () => {
    this.setState({showAddList: true});
  };

  showAlert() {
    if (this.state.showAddList) return <ListTaskAlert screen={this} />;
  }

  render() {
    const {project, rowRepository} = this.state;
    const {source, resizeMode} = this.props.route.params;
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
              <Button transparent>
                <Icon name="ellipsis-vertical" />
              </Button>
            </Right>
          </Header>
          {this.showAlert()}
          <Board
            contentContainerStyle={styles.containerListTask}
            rowRepository={rowRepository}
            renderRow={this.renderRow.bind(this)}
            renderColumnWrapper={this.renderColumnWrapper.bind(this)}
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
        <TaskItem />
      </View>
    );
  }

  renderColumnWrapper(column, index, columnComponent) {
    return (
      <View style={styles.itemListTask}>
        <ListTaskItem columnTask={column} component={columnComponent} />
      </View>
    );
  }

  onOpen(item) {
    this.props.navigation.navigate('Task', {task: item});
  }

  onDragEnd(srcColumnId, destColumnId, item) {}
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
});
