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
  const {members, arrAssign} = screen.state;
  const assignList = arrAssign;
  const [assigns, setAssigns] = useState(assignList);

  const doneAssign = () => {
    screen.setState({
      arrAssign: assigns,
      alert: typeAlert.NONE,
    });
  };

  const addAssign = item => {
    let newAssign = {...item};
    delete newAssign.admin;

    const index = assigns.findIndex(element => element.uid == item.uid);
    const newAssigns = [...assigns];

    if (index != -1) newAssigns.splice(index, 1);
    else newAssigns.push(newAssign);
    setAssigns(newAssigns);
  };

  const iconRight = item => {
    const found = assigns.find(element => element.uid == item.uid);
    if (found)
      return (
        <Icon
          name="checkmark-sharp"
          style={{
            color: colors.Disable,
            fontSize: 20,
          }}
        />
      );
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
            data={members}
            renderItem={({item, index}) => (
              <View style={{marginVertical: 10}}>
                <ListItem avatar onPress={() => addAssign(item)}>
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
