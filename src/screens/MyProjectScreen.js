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
      projects: [],
      showAlert: false,
    };
    this.currentUser = auth().currentUser;
  }

  componentDidMount() {
    this.setState({loading: true});
    const subscriber = firestore()
      .collection('Users')
      .doc(this.currentUser.uid)
      .onSnapshot(querySnapshot => {
        const projects = [];
        const MyProjectIdCopy = [];
        const MyProjectIds = querySnapshot.get('myProjects');

        this.getAllInfoProject(MyProjectIds, 0, projects, MyProjectIdCopy);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  getAllInfoProject(MyProjectIds, index, projects, MyProjectIdCopy) {
    if (!MyProjectIds) {
      this.setState({
        projects: projects,
        loading: false,
      });
      return;
    }
    if (index == MyProjectIds.length) {
      // update my id projects if have change
      if (MyProjectIdCopy.length != MyProjectIds.length)
        firestore()
          .collection('Users')
          .doc(this.currentUser.uid)
          .update({myProjects: MyProjectIdCopy});

      this.setState({
        projects: projects,
        loading: false,
      });
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
            name: result.get('name'),
            note: result.get('note'),
            photoURL: result.get('photoURL'),
          };
          projects.push(project);
          MyProjectIdCopy.push(MyProjectIds[index]);
        }
      })
      .finally(() => {
        this.getAllInfoProject(
          MyProjectIds,
          index + 1,
          projects,
          MyProjectIdCopy,
        );
      });
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
                onPress={() => navigation.navigate('Project', {Project: item})}
              />
            </View>
          )}
          keyExtractor={item => item.id}
        />
      );
    };

    const showAlert = () => {
      if (this.state.showAlert) return <AddProjectAlert screen={this} />;
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
        {showAlert()}
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
