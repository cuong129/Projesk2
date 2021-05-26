import React, {useState} from 'react';
import AlertView from './AlertView';
import {
  ListItem,
  Text,
  Left,
  Right,
  Body,
  Icon,
  Thumbnail,
  Item,
} from 'native-base';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {firestore} from '../../firebase';
import {colors} from '../../res/colors';
import {typeAlert} from '.';

const AssignAlert = ({screen}) => {
  const props = screen.props.route.params;
  const assignList = props.task.assigns;
  const [assigns, setAssigns] = useState(assignList);

  const doneAssign = () => {
    // const newMembers = [...screen.state.members];
    // newMembers[screen.state.index].admin = isAdmin;
    // firestore().collection('Projects').doc(screen.idProject).update({
    //   members: newMembers,
    // });
    // screen.setState({
    //   members: newMembers,
    //   alert: typeAlert.NONE,
    // });
  };

  const addAssign = item => {
    let newAssign = {...item};
    delete newAssign.name;
    delete newAssign.admin;

    const newAssigns = [...assigns, newAssign];
    setAssigns(newAssigns);
  };

  const iconRight = item => {
    assigns.forEach(element => {
      if (element.uid == item.uid)
        return (
          <Icon
            name="checkmark-sharp"
            style={{
              color: colors.Disable,
              fontSize: 20,
            }}
          />
        );
    });
  };

  return (
    <AlertView
      screen={screen}
      title="Task Assign"
      positiveButtonText="DONE"
      positiveButtonPress={doneAssign}
      componentBody={
        <View>
          <FlatList
            data={props.members}
            renderItem={({item, index}) => (
              <View style={{marginVertical: 10}}>
                <ListItem avatar onPress={()=>addAssign(item)}>
                  <Left>
                    <Thumbnail source={{uri: item.photoURL}} small />
                  </Left>
                  <Body>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>{item.name}</Text>
                      {iconRight(item)}
                    </View>
                  </Body>
                </ListItem>
              </View>
            )}
            keyExtractor={item => item.uid}
          />
        </View>
      }
    />
  );
};

export default AssignAlert;
