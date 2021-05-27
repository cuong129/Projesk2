import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet} from 'react-native';
import { Container} from 'native-base';
import { colors } from '../res/colors'
import { auth } from '../firebase'
import NotificationItem from '../components/NotificationItem';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

export default class NotifyScreen extends Component {
  constructor(props) {
    super(props);
    this.currentUser = auth().currentUser;
    this.state = {
      arrNoti: [{
        id: 1,
        name: this.currentUser.displayName,
        photoURL: this.currentUser.photoURL,
        type: 'invite',
        idProject: "8q2qhSgVqTWHZ4Wq3SCH",
      },
      {
        id: 2,
        name: this.currentUser.displayName,
        photoURL: this.currentUser.photoURL,
        type: 'remove',
        idProject: "8q2qhSgVqTWHZ4Wq3SCH",
      },
      {
        id: 3,
        name: this.currentUser.displayName,
        photoURL: this.currentUser.photoURL,
        type: 'deadline',
        idProject: "vBIgMBoaNgZlNNUqLIj9",
      },
      {
        id: 4,
        name: this.currentUser.displayName,
        photoURL: this.currentUser.photoURL,
        type: 'assign',
        idProject: "vBIgMBoaNgZlNNUqLIj9",
      }]
    }
  }
  handlePressItem = (id) => {
    const index = this.state.arrNoti.findIndex(item => item.id === id);
    if (arrNoti[index].type === 'invite') {

    }
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
                item={item} />
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
