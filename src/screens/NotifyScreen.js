import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Container } from 'native-base';
import { colors } from '../res/colors'
import { auth, firestore, deleteNoti, seenNoti } from '../firebase'
import NotificationItem from '../components/NotificationItem';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

export default class NotifyScreen extends Component {
  constructor(props) {
    super(props);
    this.currentUser = auth().currentUser;
    this.state = {
      arrNoti: []
    }
  }
  componentDidMount() {
    this.subscriber = firestore()
      .collection('Users')
      .doc(this.currentUser.uid)
      .onSnapshot(documentSnapshot => {
        var data = documentSnapshot.data().notifications;
        data = data.filter(item => item.date.toDate().getTime() <= new Date().getTime());
        data.sort((firstEl, secondEl) => {
          return secondEl.date.toDate().getTime() - firstEl.date.toDate().getTime();
        });
        this.setState({arrNoti: data})
      });
    return () => this.subscriber();
  }
  componentWillUnmount() {
    this.subscriber();
  }

  handlePressItem = (id) => {
    const { arrNoti } = this.state;
    const index = arrNoti.findIndex(item => item.id === id);
    
    if (!arrNoti[index].seen) {
      seenNoti(this.currentUser.uid, id);
    }

    if (arrNoti[index].type === 'invite') {
      this.props.navigation.navigate('Project', {
        screen: 'ProjectMain',
        params: {
          idProject: arrNoti[index].idProject,
        },
      })
    }
    else if (arrNoti[index].type === 'assign' || arrNoti[index].type === 'deadline' || arrNoti[index].type === 'comment') {
      this.props.navigation.navigate('Project', {
        screen: 'Task',
        params: {
          idProject: arrNoti[index].idProject,
          columnIndex: arrNoti[index].columnIndex,
          index: arrNoti[index].index,
        }
      });
    }
  }
  handleDeleteNoti = (id) => {
    deleteNoti(this.currentUser.uid, id);
  }
  render() {
    return (
      <Container style={{ backgroundColor: colors.Background }}>
        <FocusAwareStatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Notifications</Text>
        </View>
        <FlatList
          data={this.state.arrNoti}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPressItem={this.handlePressItem}
              onPressDelete={this.handleDeleteNoti} />
          )}
        />
      </Container>
    )
  }
}
const styles = StyleSheet.create({
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
})
