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
import {ProjectAlert, typeAlert} from '../components/AlertCustom/index';
import {auth, firestore} from '../firebase';
import SearchBar from '../components/SearchBar';

export default class MyProjectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      projects: [],
      alert: typeAlert.NONE,
      isSearch: false,
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
    return () => this.subscriber();
  }

  componentWillUnmount() {
    this.subscriber();
  }

  getAllInfoProject(MyProjectIds, index, projects) {
    if (!MyProjectIds) {
      this.setState({
        projects: projects,
        loading: false,
      });
      return;
    }
    if (index == MyProjectIds.length) {
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
        } else {
          firestore()
            .collection('Users')
            .doc(this.currentUser.uid)
            .update({
              myProjects: firestore.FieldValue.arrayRemove(MyProjectIds[index]),
            });
        }
      })
      .finally(() => {
        this.getAllInfoProject(MyProjectIds, index + 1, projects);
      });
  }

  render() {
    const {navigation} = this.props;
    const {isSearch, projects} = this.state;
    this.data = isSearch ? this.data : [...projects];

    const componentBody = () => {
      if (this.state.loading)
        return (
          <View style={styles.containerView}>
            <ActivityIndicator color={colors.Primary} size="large" />
          </View>
        );
      if (this.data.length == 0)
        return (
          <View style={styles.containerView}>
            <Icon name="cube" style={styles.iconEmpty} />
            {(isSearch && <Text note>No result</Text>) || (
              <View style={{alignItems: 'center'}}>
                <Text note>You have no projects</Text>
                <Text note>Tap + to create a new one</Text>
              </View>
            )}
          </View>
        );
      return (
        <FlatList
          data={this.data}
          contentContainerStyle={styles.container}
          numColumns={2}
          renderItem={({item}) => {
            const url = item.photoURL;
            const source =
              url == null || url === ''
                ? require('../res/images/ic_app.png')
                : {uri: url};
            const resizeMode = url == null || url === '' ? 'center' : 'cover';

            return (
              <View style={styles.wrapper}>
                <ProjectItem
                  SetSourceImage={source}
                  SetResizeModeImage={resizeMode}
                  project={item}
                  onPress={() =>
                    navigation.navigate('Project', {
                      screen: 'ProjectMain',
                      params: {
                        idProject: item.id,
                      },
                    })
                  }
                />
              </View>
            );
          }}
          keyExtractor={item => item.id}
        />
      );
    };

    const showAlert = () => {
      if (this.state.alert == typeAlert.CREATE_PROJECT)
        return <ProjectAlert screen={this} type={typeAlert.CREATE_PROJECT} />;
    };

    return (
      <Container style={{backgroundColor: colors.Background}}>
        <Header style={{backgroundColor: 'white'}}>
          <SearchBar
            style={styles.searchBar}
            placeholder="Search projects..."
            onSearch={text => this.handleSearch(text)}
            endSearch={() => this.setState({isSearch: false})}
          />
        </Header>
        <FocusAwareStatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.titleView}>
          <Text style={styles.titleText}>My Projects</Text>
        </View>
        {showAlert()}
        {componentBody()}
        {isSearch ? null : (
          <Fab
            style={{backgroundColor: colors.Primary}}
            onPress={() => this.setState({alert: typeAlert.CREATE_PROJECT})}>
            <Icon name="add" />
          </Fab>
        )}
      </Container>
    );
  }

  handleSearch(text) {
    this.data = this.state.projects.filter(e =>  e.name.toLowerCase().includes(text.toLowerCase()));
    this.setState({isSearch: true});
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
    paddingHorizontal: 25,
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
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 5,
  },
});
