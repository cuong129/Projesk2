import React, {useState} from 'react';
import AlertView from './AlertView';
import {ListItem, Text, Left, Right, Body, Icon} from 'native-base';
import {View, FlatList} from 'react-native';
import {firestore} from '../../firebase';
import {colors} from '../../res/colors';
import {typeAlert} from '.';

const AssignAlert = ({screen}) => {
  const [isAdmin, setIsAdmin] = useState(screen.state.item.admin);

  const updatePermission = () => {
    const newMembers = [...screen.state.members];
    newMembers[screen.state.index].admin = isAdmin;

    firestore().collection('Projects').doc(screen.idProject).update({
      members: newMembers,
    });

    screen.setState({
      members: newMembers,
      alert: typeAlert.NONE,
    });
  };

  const iconRight = (item, index) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          margin: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon
          name="checkmark-sharp"
          style={{
            color: colors.Disable,
            fontSize: 28,
          }}
        />
      </View>
    );
  };

  return (
    <AlertView
      screen={screen}
      title="Task Assign"
      positiveButtonText="DONE"
      positiveButtonPress={updatePermission}
      componentBody={
        <View>
          <FlatList
            data={members}
            renderItem={({item, index}) => (
              <ListItem avatar>
                <Left>
                  <Thumbnail source={{uri: item.photoURL}} small />
                </Left>
                <Body>
                  <Text>{item.name}</Text>
                </Body>
                <Right>{iconRight(item, index)}</Right>
              </ListItem>
            )}
            keyExtractor={item => item.uid}
          />
        </View>
      }
    />
  );
};

export default AssignAlert;
