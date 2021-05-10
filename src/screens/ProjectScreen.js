import React, {Component} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Content,
  Card,
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
  TouchableOpacity,
  Dimensions
} from 'react-native';
import colors from '../res/colors';
import ListTaskItem from '../components/ListTaskItem';
import TaskItem from '../components/TaskItem';
import {Board, RowRepository} from '../components/Board/index';

const deviceHeight = Dimensions.get('window').height;

export default class ProjectScreen extends Component {
  constructor(props) {
    super(props);
    const data = [
      {
        id: 1,
        name: 'To do',
        rows: [
          {id: 1, name: 'Map'},
          {id: 2, name: 'Grid'},
          {id: 4, name: 'me'},
        ],
      },
      {
        id: 2,
        name: 'Done',
        rows: [{id: 3, name: 'Boss'}],
      },
      {
        id: 3,
        name: 'Doing',
        rows: [{id: 5, name: 'collision'}],
      },
    ];

    this.state = {rowRepository: new RowRepository(data)};
    this.project = this.props.route.params.project;
  }

  SetDefaultStyleImage = url => {
    if (url == null) return 'center';
    return 'cover';
  };

  SetDefaultImage = url => {
    if (url == null) return require('../res/images/ic_app.png');
    return require('../res/images/background.jpg');
  };

  render() {
    return (
      <ImageBackground
        source={this.SetDefaultImage(this.project.urlBackground)}
        style={{flex: 1}}
        imageStyle={styles.image}
        resizeMode={this.SetDefaultStyleImage(this.project.urlBackground)}>
        <Container style={styles.container}>
          <Header style={{backgroundColor: 'transparent'}}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{this.project.name}</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="ellipsis-vertical" />
              </Button>
            </Right>
          </Header>
          <Board
            contentContainerStyle={styles.containerListTask}
            rowRepository={this.state.rowRepository}
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

  renderColumnWrapper(column, index, columnComponent, drag) {
    return (
      <TouchableOpacity style={styles.itemListTask} onLongPress={drag} activeOpacity={0.8}>
        <ListTaskItem columnTask={column} component={columnComponent} />
      </TouchableOpacity>
    );
  }

  onOpen(item) {}

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
  },
  containerListTask: {
    paddingHorizontal: 10,
  },
  cardTask: {
    width: 280,
  },
});
