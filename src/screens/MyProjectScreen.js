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
import {StyleSheet, FlatList, View} from 'react-native';
import {colors} from '../res/colors';
import ProjectItem from '../components/ProjectItem';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

export default class ListThumbnailExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [
        {
          id: 1,
          name: 'Game',
          note: '10 score',
          urlBackground: '../res/images/background.jpg',
        },
        {id: 2, name: 'Mobile', note: '9 score'},
        {id: 2, name: 'Web', note: '10 score'},
        {id: 2, name: 'Desktop', note: '9 score'},
      ],
    };
  }

  render() {
    const {navigation} = this.props;
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
        <Fab style={{backgroundColor: colors.Primary}}>
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
    flex: 1,
    paddingHorizontal: 4,
  },
  titleView: {
    backgroundColor: '#FFF',
    elevation: 0.5,
  },
  titleText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 20,
  },
});
