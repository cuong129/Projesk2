import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { Icon } from 'native-base';
import { colors, ColorBoard } from '../res/colors';
import { firestore } from '../firebase';

export default class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      detail: '',
      iconName: 'reload',
      iconColor: colors.Primary,
    };
  }
  componentDidMount() {
    const { item } = this.props;
    firestore()
      .collection('Projects')
      .doc(item.idProject)
      .get()
      .then(documentSnapshot => {
        this.setState({ project: documentSnapshot.data() });
        this.initValue();
      });
  }
  initValue() {
    const { item } = this.props;
    const { project } = this.state;
    if (item.type === 'invite') {
      this.setState({
        detail: "invited you to project ",
        iconName: "ios-person-add",
        iconColor: colors.Primary,
      });
    } else if (item.type === 'remove') {
      this.setState({
        detail: "removed you from project ",
        iconName: "ios-person-remove",
        iconColor: ColorBoard[1],
      });
    } else if (item.type === 'assign') {
      this.setState({
        detail: "assigned you to task ",
        iconName: "star",
        iconColor: ColorBoard[2],
      });
    } else if (item.type === 'deadline') {
      this.setState({
        detail: "Your task ",
        iconName: "calendar",
        iconColor: ColorBoard[0],
      });
    }
  }
  render() {
    const { item, onPressItem } = this.props;
    const { detail, iconName, iconColor, project } = this.state;
    return (
      <TouchableOpacity style={styles.container} onPress={() => { onPressItem(item.id) }}>
        <View style={{ padding: 10, paddingRight: 20, }}>
          <Image
            style={styles.imageCircle}
            source={{ uri: item.photoURL }}
          />
          <View style={[styles.notiIcon, { backgroundColor: iconColor }]}>
            <Icon style={styles.iconStyle} name={iconName} type='Ionicons' />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {item.type !== "deadline" && (<Text style={{ fontWeight: 'bold' }}>{item.name}</Text>)}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text>{detail}</Text>
            <Text style={{ fontWeight: 'bold' }}>{project.name}</Text>
          </View>
          <Text style={{ justifyContent: 'flex-end' }}>5 minutes ago</Text>
        </View>
        <TouchableOpacity>
          <Icon name="circle-with-cross" type='Entypo' style={{ color: colors.Danger, fontSize: 20, paddingHorizontal: 15 }} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3773E1',
    marginBottom: 5,
  },
  notiIcon: {
    position: 'absolute',
    left: 40,
    top: 40,
    borderRadius: 20,
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  iconStyle: {
    fontSize: 16,
    color: '#fff',
    position: 'absolute',
    left: 7,
    top: 6,
  }
})