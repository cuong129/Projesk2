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
} from 'native-base';
import {StyleSheet, FlatList, View, ActivityIndicator} from 'react-native';
import {colors} from '../res/colors';
import ProjectItem from '../components/ProjectItem';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import {AddProjectAlert} from '../components/AlertCustom/index';
import {auth, firestore} from '../firebase';

export default class ListThumbnailExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      projects: [
        // {
        //   id: 1,
        //   name: 'Game',
        //   note: '10 score',
        //   urlBackground: '../res/images/background.jpg',
        // },
        // {id: 2, name: 'Mobile', note: '9 score'},
        // {id: 3, name: 'Web', note: '10 score'},
        // {id: 4, name: 'desktop', note: '10 score'},
      ],
      showAlert: false,
    };
  }

  componentDidMount() {
    const subscriber = firestore()
      .collection('Projects')
      .onSnapshot(querySnapshot => {
        const projects = [];

        querySnapshot.forEach(documentSnapshot => {
          projects.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });

        this.setState({
          projects: projects,
          loading: false
        })
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  render() {
    const {navigation} = this.props;

    const componentBody = () => {
      if (this.state.loading)
        return (
          <View style={styles.containerView}>
            <ActivityIndicator color={colors.Primary} size="large" />
          </View>
        );
      if (this.state.projects.length == 0)
        return (
          <View style={styles.containerView}>
            <Icon name="cube" style={styles.iconEmpty} />
            <Text note>You have no projects</Text>
            <Text note>Tap + to create a new one</Text>
          </View>
        );
      return (
        <FlatList
          data={this.state.projects}
          contentContainerStyle={styles.container}
          numColumns={2}
          renderItem={({item}) => (
            <View style={styles.wrapper}>
              <ProjectItem
                project={item}
                onPress={() => navigation.navigate('Project', {project: item})}
              />
            </View>
          )}
          keyExtractor={item => item.id}
        />
      );
    };

    return (
      <Container style={{backgroundColor: colors.Background}}>
        <Header style={{backgroundColor: 'white'}} searchBar rounded>
          <Item>
            <Icon name="search" />
            <Input placeholder="Search projects..." />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        <FocusAwareStatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.titleView}>
          <Text style={styles.titleText}>My Projects</Text>
        </View>
        <AddProjectAlert screen={this} />
        {componentBody()}
        <Fab
          style={{backgroundColor: colors.Primary}}
          onPress={() => {
            this.setState({showAlert: true});
          }}>
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  wrapper: {
    width: '50%',
    paddingHorizontal: 4,
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
});
