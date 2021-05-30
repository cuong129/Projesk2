import React, {Component} from 'react';
import {
  Container,
  Header,
  Text,
  StyleProvider,
  Left,
  Right,
  Body,
  Button,
  Icon,
  Title,
  ListItem,
  Thumbnail,
  Fab,
} from 'native-base';
import {StatusBar, StyleSheet, View, FlatList, Alert} from 'react-native';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { colors } from '../res/colors';
import { auth, firestore, updateProjectNoti, addActivity, typeActivity } from '../firebase';
import {
  typeAlert,
  AddMemberAlert,
  EditMemberAlert,
} from '../components/AlertCustom';

export default class MemberScreen extends Component {
  constructor(props) {
    super(props);

    this.currentUser = auth().currentUser;
    this.idProject = this.props.route.params.idProject;
    this.state = {
      admin: false,
      alert: typeAlert.NONE,
      members: this.props.route.params.members,
      item: null,
      index: -1,
    };
  }

  componentDidMount() {
    const found = this.props.route.params.members.find(
      element => element.uid == this.currentUser.uid,
    );

    if (found) this.setState({admin: found.admin});
  }

  showAlert() {
    switch (this.state.alert) {
      case typeAlert.ADD_MEMBER:
        return <AddMemberAlert screen={this} />;
      case typeAlert.EDIT_MEMBER:
        return <EditMemberAlert screen={this} />;
      default:
      // code block
    }
  }

  deleteMember(item, index) {
    Alert.alert('Warning', 'Are you sure delete member ' + item.name, [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          const newMembers = [...this.state.members];
          newMembers.splice(index, 1);

          this.setState({members: newMembers});

          firestore()
            .collection('Projects')
            .doc(this.idProject)
            .update({
              members: firestore.FieldValue.arrayRemove(item),
            });

          firestore()
            .collection('Users')
            .doc(item.uid)
            .update({
              myProjects: firestore.FieldValue.arrayRemove(this.idProject),
            });
          //add noti remove + delete noti invite
          updateProjectNoti(item.uid, this.currentUser, this.idProject);
          //add activity
          let content = this.currentUser.displayName + ' remove ' + item.name + ' from project';
          addActivity(content, typeActivity.REMOVE_MEMBER, this.idProject);
        },
      },
    ]);
  }

  render() {
    const {navigation} = this.props;
    const {admin, members} = this.state;

    const iconRight = (item, index) => {
      if (!admin) return;
      if (this.currentUser.uid == item.uid) return;
      return (
        <View style={styles.viewIconRight}>
          <Icon
            name="account-edit-outline"
            style={{
              color: colors.Warning,
              fontSize: 28,
            }}
            type="MaterialCommunityIcons"
            onPress={() =>
              this.setState({
                alert: typeAlert.EDIT_MEMBER,
                item: item,
                index: index,
              })
            }
          />
          <Icon
            name="person-remove-sharp"
            style={{
              color: colors.Danger,
              fontSize: 24,
              marginLeft: 20,
            }}
            type="Ionicons"
            onPress={() => {
              this.deleteMember(item, index);
            }}
          />
        </View>
      );
    };

    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <StatusBar translucent={false} />
          <Header style={{backgroundColor: colors.Primary}}>
            <Left>
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Member</Title>
            </Body>
            <Right />
          </Header>
          <FlatList
            data={members}
            renderItem={({item, index}) => (
              <ListItem avatar>
                <Left>
                  <Thumbnail source={{uri: item.photoURL}} small />
                </Left>
                <Body>
                  <Text>{item.name}</Text>
                  <Text note>{item.admin ? 'Admin' : 'Normal'}</Text>
                </Body>
                <Right>{iconRight(item, index)}</Right>
              </ListItem>
            )}
            keyExtractor={item => item.uid}
          />
          {this.showAlert()}
          <Fab
            style={{backgroundColor: colors.Positive}}
            onPress={() => this.setState({alert: typeAlert.ADD_MEMBER})}>
            <Icon name="person-add" type="MaterialIcons" />
          </Fab>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  viewIconRight: {
    justifyContent: 'center',
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
