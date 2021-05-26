import React, {useState} from 'react';
import AlertView from './AlertView';
import {ListItem, Text, Radio} from 'native-base';
import {View} from 'react-native';
import {firestore} from '../../firebase';
import {colors} from '../../res/colors';
import {typeAlert} from '.';

const EditMemberAlert = ({screen}) => {
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

  return (
    <AlertView
      screen={screen}
      title="Edit Permission"
      positiveButtonText="SAVE"
      positiveButtonPress={updatePermission}
      componentBody={
        <View>
          <Text note>{screen.state.item.name}</Text>
          <ListItem>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Radio
                color={colors.Disable}
                selectedColor={colors.Positive}
                selected={isAdmin}
                onPress={() => setIsAdmin(true)}
              />
              <Text note style={{paddingLeft: 10}}>
                ADMIN{'\n'}Admins can manage board members and preferences, in
                addition to normal privileges
              </Text>
            </View>
          </ListItem>
          <ListItem>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Radio
                color={colors.Disable}
                selectedColor={colors.Positive}
                selected={!isAdmin}
                onPress={() => setIsAdmin(false)}
              />
              <Text note style={{paddingLeft: 10}}>
                NORMAL{'\n'}Normal members can create and edit tasks and lists
              </Text>
            </View>
          </ListItem>
        </View>
      }
    />
  );
};

export default EditMemberAlert;
